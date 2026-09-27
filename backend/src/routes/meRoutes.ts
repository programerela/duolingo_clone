import { Router } from 'express';
import { deleteAccount, getMe } from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { deleteAccountSchema } from '../schemas/profileSchemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(getMe));
router.delete('/', validate(deleteAccountSchema), asyncHandler(deleteAccount));

export default router;
