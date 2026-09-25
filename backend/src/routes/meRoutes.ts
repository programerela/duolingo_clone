import { Router } from 'express';
import { getMe } from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authMiddleware, asyncHandler(getMe));

export default router;
