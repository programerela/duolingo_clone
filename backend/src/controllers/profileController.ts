import { Request, Response } from 'express';
import { query } from '../config/db';
import { HttpError } from '../utils/httpError';

export async function getMe(req: Request, res: Response) {
  const userId = req.user!.id;

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

  res.json({
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
  });
}

export async function getProfile(req: Request, res: Response) {
  return getMe(req, res);
}
