import { Request, Response } from 'express';
import { query, withTransaction } from '../config/db';
import { HttpError } from '../utils/httpError';

const ENERGY_REFILL_COST = 20;
const STREAK_FREEZE_COST = 30;

async function loadShopState(userId: string) {
  const stats = await query<{
    gems_balance: number;
    energy_current: number;
    energy_max: number;
  }>(
    `
      SELECT gems_balance, energy_current, energy_max
      FROM user_stats
      WHERE user_id = $1
    `,
    [userId]
  );

  if (!stats.rows[0]) throw new HttpError(404, 'User stats are missing');

  const freezes = await query<{ count: number }>(
    `
      SELECT COUNT(*)::int AS count
      FROM streak_freezes
      WHERE user_id = $1 AND used_on_date IS NULL
    `,
    [userId]
  );

  return {
    gems: stats.rows[0].gems_balance,
    energy: {
      current: stats.rows[0].energy_current,
      max: stats.rows[0].energy_max
    },
    streakFreezes: freezes.rows[0]?.count ?? 0,
    prices: {
      energyRefill: ENERGY_REFILL_COST,
      streakFreeze: STREAK_FREEZE_COST
    }
  };
}

export async function getShop(req: Request, res: Response) {
  res.json(await loadShopState(req.user!.id));
}

export async function refillEnergy(req: Request, res: Response) {
  const userId = req.user!.id;

  const result = await withTransaction(async (client) => {
    const statsResult = await client.query<{
      gems_balance: number;
      energy_current: number;
      energy_max: number;
    }>(
      `
        SELECT gems_balance, energy_current, energy_max
        FROM user_stats
        WHERE user_id = $1
        FOR UPDATE
      `,
      [userId]
    );

    const stats = statsResult.rows[0];
    if (!stats) throw new HttpError(404, 'User stats are missing');
    if (stats.energy_current >= stats.energy_max) {
      throw new HttpError(409, 'Energy is already full');
    }
    if (stats.gems_balance < ENERGY_REFILL_COST) {
      throw new HttpError(400, `You need ${ENERGY_REFILL_COST} gems to refill energy`);
    }

    await client.query(
      `
        UPDATE user_stats
        SET gems_balance = gems_balance - $2,
            energy_current = energy_max,
            energy_updated_at = NOW()
        WHERE user_id = $1
      `,
      [userId, ENERGY_REFILL_COST]
    );

    return {
      message: 'Energy refilled',
      gemsSpent: ENERGY_REFILL_COST,
      gems: stats.gems_balance - ENERGY_REFILL_COST,
      energy: { current: stats.energy_max, max: stats.energy_max }
    };
  });

  res.json(result);
}

export async function buyStreakFreeze(req: Request, res: Response) {
  const userId = req.user!.id;

  const result = await withTransaction(async (client) => {
    const statsResult = await client.query<{ gems_balance: number }>(
      `SELECT gems_balance FROM user_stats WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );

    const stats = statsResult.rows[0];
    if (!stats) throw new HttpError(404, 'User stats are missing');
    if (stats.gems_balance < STREAK_FREEZE_COST) {
      throw new HttpError(400, `You need ${STREAK_FREEZE_COST} gems to buy a Streak Freeze`);
    }

    await client.query(
      `UPDATE user_stats SET gems_balance = gems_balance - $2 WHERE user_id = $1`,
      [userId, STREAK_FREEZE_COST]
    );
    await client.query(`INSERT INTO streak_freezes (user_id) VALUES ($1)`, [userId]);

    const ownedResult = await client.query<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM streak_freezes WHERE user_id = $1 AND used_on_date IS NULL`,
      [userId]
    );

    return {
      message: 'Streak Freeze purchased',
      gemsSpent: STREAK_FREEZE_COST,
      gems: stats.gems_balance - STREAK_FREEZE_COST,
      streakFreezes: ownedResult.rows[0]?.count ?? 1
    };
  });

  res.status(201).json(result);
}
