import { Request, Response } from 'express';
import { query } from '../config/db';

export async function getWeeklyLeaderboard(req: Request, res: Response) {
  const userId = req.user!.id;

  const result = await query<{
    user_id: string;
    username: string;
    display_name: string | null;
    avatar_key: string | null;
    xp_this_week: number;
    league: string;
  }>(
    `
      SELECT
        le.user_id,
        u.username,
        u.display_name,
        u.avatar_key,
        le.xp_this_week,
        le.league
      FROM leaderboard_entries le
      JOIN users u ON u.id = le.user_id
      WHERE le.week_start = date_trunc('week', CURRENT_DATE)::date
      ORDER BY le.xp_this_week DESC, u.username ASC
      LIMIT 50
    `
  );

  res.json({
    weekStart: new Date().toISOString(),
    entries: result.rows.map((row, index) => ({
      rank: index + 1,
      userId: row.user_id,
      username: row.username,
      displayName: row.display_name,
      avatarKey: row.avatar_key,
      xp: row.xp_this_week,
      league: row.league,
      isCurrentUser: row.user_id === userId
    }))
  });
}
