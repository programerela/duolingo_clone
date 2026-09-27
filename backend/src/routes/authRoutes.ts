import { Router } from 'express';
import { login, logout, refresh, register } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/authMiddleware';
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from '../schemas/authSchemas';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', validate(refreshSchema), asyncHandler(refresh));
router.post('/logout', authMiddleware, validate(logoutSchema), asyncHandler(logout));

export default router;
