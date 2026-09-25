import { Router } from 'express';
import { getProfile } from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(getProfile));

export default router;
