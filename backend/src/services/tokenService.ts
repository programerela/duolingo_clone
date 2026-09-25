import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PoolClient } from 'pg';
import { env } from '../config/env';

export function createAccessToken(userId: string): string {
  return jwt.sign(
    { type: 'access' },
    env.JWT_ACCESS_SECRET,
    {
      subject: userId,
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']
    }
  );
}

export function createRawRefreshToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function storeRefreshToken(
  client: PoolClient,
  userId: string,
  rawToken: string
) {
  const tokenHash = hashRefreshToken(rawToken);

  await client.query(
    `
      INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, NOW() + ($3 || ' days')::interval)
    `,
    [userId, tokenHash, env.REFRESH_TOKEN_DAYS]
  );
}
