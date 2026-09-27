import { Router } from 'express';
import {
  changePassword,
  getProfile,
  updateProfile
} from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import {
  changePasswordSchema,
  updateProfileSchema
} from '../schemas/profileSchemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(getProfile));
router.patch('/', validate(updateProfileSchema), asyncHandler(updateProfile));
router.patch('/password', validate(changePasswordSchema), asyncHandler(changePassword));

export default router;
