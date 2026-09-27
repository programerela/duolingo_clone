import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';
import { buyStreakFreeze, getShop, refillEnergy } from '../controllers/shopController';

const router = Router();
router.use(authMiddleware);
router.get('/', asyncHandler(getShop));
router.post('/refill-energy', asyncHandler(refillEnergy));
router.post('/streak-freeze', asyncHandler(buyStreakFreeze));
export default router;
