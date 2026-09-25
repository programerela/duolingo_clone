import { Router } from 'express';
import { getWeeklyLeaderboard } from '../controllers/leaderboardController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);
router.get('/weekly', asyncHandler(getWeeklyLeaderboard));

export default router;
