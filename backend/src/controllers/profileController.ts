import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query, withTransaction } from '../config/db';
import { HttpError } from '../utils/httpError';

async function loadMe(userId: string) {
  const result = await query<{
    id: string;
    email: string;
    username: string;
    display_name: string | null;
    timezone: string;
    avatar_key: string | null;
    created_at: string;
    xp_total: number;
    streak_count: number;
    longest_streak: number;
    gems_balance: number;
    energy_current: number;
    energy_max: number;
    lessons_completed: number;
    active_course_id: string | null;
    active_course_title: string | null;
    active_course_flag: string | null;
  }>(
    `
      SELECT
        u.id,
        u.email,
        u.username,
        u.display_name,
        u.timezone,
        u.avatar_key,
        u.created_at,
        us.xp_total,
        us.streak_count,
        us.longest_streak,
        us.gems_balance,
        us.energy_current,
        us.energy_max,
        us.lessons_completed,
        c.id AS active_course_id,
        c.title AS active_course_title,
        c.flag_key AS active_course_flag
      FROM users u
      JOIN user_stats us ON us.user_id = u.id
      LEFT JOIN user_courses uc
        ON uc.user_id = u.id
       AND uc.is_active = TRUE
      LEFT JOIN courses c ON c.id = uc.course_id
      WHERE u.id = $1
    `,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.display_name,
    timezone: user.timezone,
    avatarKey: user.avatar_key,
    createdAt: user.created_at,
    stats: {
      xpTotal: user.xp_total,
      streak: user.streak_count,
      longestStreak: user.longest_streak,
      gems: user.gems_balance,
      energy: {
        current: user.energy_current,
        max: user.energy_max
      },
      lessonsCompleted: user.lessons_completed
    },
    activeCourse: user.active_course_id
      ? {
          id: user.active_course_id,
          title: user.active_course_title,
          flagKey: user.active_course_flag
        }
      : null
  };
}

export async function getMe(req: Request, res: Response) {
  res.json(await loadMe(req.user!.id));
}

export async function getProfile(req: Request, res: Response) {
  res.json(await loadMe(req.user!.id));
}

export async function updateProfile(req: Request, res: Response) {
  const userId = req.user!.id;
  const { displayName, username, timezone, avatarKey } = req.body;

  if (username !== undefined) {
    const existing = await query(
      `
        SELECT 1
        FROM users
        WHERE LOWER(username) = LOWER($1)
          AND id <> $2
        LIMIT 1
      `,
      [username.trim(), userId]
    );

    if (existing.rowCount) {
      throw new HttpError(409, 'Username is already in use');
    }
  }

  const assignments: string[] = [];
  const values: unknown[] = [];

  const pushValue = (column: string, value: unknown) => {
    values.push(value);
    assignments.push(`${column} = $${values.length}`);
  };

  if (displayName !== undefined) pushValue('display_name', displayName);
  if (username !== undefined) pushValue('username', username.trim());
  if (timezone !== undefined) pushValue('timezone', timezone.trim());
  if (avatarKey !== undefined) pushValue('avatar_key', avatarKey);

  values.push(userId);

  await query(
    `
      UPDATE users
      SET ${assignments.join(', ')}
      WHERE id = $${values.length}
    `,
    values
  );

  res.json({
    message: 'Profile updated',
    profile: await loadMe(userId)
  });
}

export async function changePassword(req: Request, res: Response) {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  const userResult = await query<{ password_hash: string }>(
    `SELECT password_hash FROM users WHERE id = $1`,
    [userId]
  );

  const user = userResult.rows[0];
  if (!user) throw new HttpError(404, 'User not found');

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) throw new HttpError(401, 'Current password is incorrect');

  const newHash = await bcrypt.hash(newPassword, 12);

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE users SET password_hash = $2 WHERE id = $1`,
      [userId, newHash]
    );

    await client.query(
      `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE user_id = $1 AND revoked_at IS NULL
      `,
      [userId]
    );
  });

  res.json({
    message: 'Password updated. Please log in again.'
  });
}

export async function deleteAccount(req: Request, res: Response) {
  const userId = req.user!.id;
  const { password } = req.body;

  const userResult = await query<{ password_hash: string }>(
    `SELECT password_hash FROM users WHERE id = $1`,
    [userId]
  );

  const user = userResult.rows[0];
  if (!user) throw new HttpError(404, 'User not found');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new HttpError(401, 'Invalid password');

  await query(`DELETE FROM users WHERE id = $1`, [userId]);

  res.status(204).send();
}
