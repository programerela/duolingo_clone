import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import lessonRoutes from './routes/lessonRoutes';
import meRoutes from './routes/meRoutes';
import profileRoutes from './routes/profileRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { notFoundMiddleware } from './middleware/notFoundMiddleware';
import { query } from './config/db';
import { asyncHandler } from './utils/asyncHandler';

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json());

app.get(
  '/api/health',
  asyncHandler(async (_req, res) => {
    const database = await query<{ now: string }>('SELECT NOW()::text AS now');

    res.json({
      status: 'ok',
      database: 'connected',
      serverTime: database.rows[0].now
    });
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/me', meRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/lessons', lessonRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
