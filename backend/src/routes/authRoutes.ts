import { Router } from 'express';
import { login, refresh, register } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';
import { loginSchema, refreshSchema, registerSchema } from '../schemas/authSchemas';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', validate(refreshSchema), asyncHandler(refresh));

export default router;
