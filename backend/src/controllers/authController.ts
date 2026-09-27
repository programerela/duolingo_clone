import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { withTransaction, query } from '../config/db';
import { HttpError } from '../utils/httpError';
import {
  createAccessToken,
  createRawRefreshToken,
  hashRefreshToken,
  storeRefreshToken
} from '../services/tokenService';

export async function register(req: Request, res: Response) {
  const { email, username, displayName, password, timezone } = req.body;

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  const existing = await query(
    `
      SELECT 1
      FROM users
      WHERE LOWER(email) = LOWER($1)
         OR LOWER(username) = LOWER($2)
      LIMIT 1
    `,
    [normalizedEmail, normalizedUsername]
  );

  if (existing.rowCount) {
    throw new HttpError(409, 'Email or username is already in use');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await withTransaction(async (client) => {
    const userResult = await client.query<{
      id: string;
      email: string;
      username: string;
      display_name: string | null;
      timezone: string;
      created_at: string;
    }>(
      `
        INSERT INTO users (
          email,
          username,
          display_name,
          password_hash,
          timezone
        )
        VALUES ($1, $2, $3, $4, COALESCE($5, 'Europe/Belgrade'))
        RETURNING id, email, username, display_name, timezone, created_at
      `,
      [normalizedEmail, normalizedUsername, displayName ?? null, passwordHash, timezone ?? null]
    );

    const user = userResult.rows[0];

    await client.query(
      `INSERT INTO user_stats (user_id) VALUES ($1)`,
      [user.id]
    );

    const refreshToken = createRawRefreshToken();
    await storeRefreshToken(client, user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.display_name,
        timezone: user.timezone,
        createdAt: user.created_at
      },
      accessToken: createAccessToken(user.id),
      refreshToken
    };
  });

  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { emailOrUsername, password } = req.body;

  const userResult = await query<{
    id: string;
    email: string;
    username: string;
    display_name: string | null;
    timezone: string;
    password_hash: string;
  }>(
    `
      SELECT id, email, username, display_name, timezone, password_hash
      FROM users
      WHERE LOWER(email) = LOWER($1)
         OR LOWER(username) = LOWER($1)
      LIMIT 1
    `,
    [emailOrUsername.trim()]
  );

  const user = userResult.rows[0];

  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const result = await withTransaction(async (client) => {
    const refreshToken = createRawRefreshToken();
    await storeRefreshToken(client, user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.display_name,
        timezone: user.timezone
      },
      accessToken: createAccessToken(user.id),
      refreshToken
    };
  });

  res.json(result);
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  const tokenHash = hashRefreshToken(refreshToken);

  const tokenResult = await query<{
    id: string;
    user_id: string;
  }>(
    `
      SELECT id, user_id
      FROM refresh_tokens
      WHERE token_hash = $1
        AND revoked_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
    `,
    [tokenHash]
  );

  const storedToken = tokenResult.rows[0];

  if (!storedToken) {
    throw new HttpError(401, 'Invalid or expired refresh token');
  }

  const result = await withTransaction(async (client) => {
    await client.query(
      `UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1`,
      [storedToken.id]
    );

    const newRefreshToken = createRawRefreshToken();
    await storeRefreshToken(client, storedToken.user_id, newRefreshToken);

    return {
      accessToken: createAccessToken(storedToken.user_id),
      refreshToken: newRefreshToken
    };
  });

  res.json(result);
}

export async function logout(req: Request, res: Response) {
  const userId = req.user!.id;
  const { refreshToken } = req.body;
  const tokenHash = hashRefreshToken(refreshToken);

  const result = await query(
    `
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE user_id = $1
        AND token_hash = $2
        AND revoked_at IS NULL
        AND expires_at > NOW()
      RETURNING id
    `,
    [userId, tokenHash]
  );

  if (!result.rowCount) {
    throw new HttpError(401, 'Invalid or expired refresh token');
  }

  res.json({ message: 'Logged out successfully' });
}
