import { Router } from 'express';
import {
  completeLesson,
  getLessonExercises
} from '../controllers/lessonController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import {
  completeLessonSchema,
  lessonIdParamsSchema
} from '../schemas/lessonSchemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);
router.get('/:id/exercises', validate(lessonIdParamsSchema), asyncHandler(getLessonExercises));
router.post('/:id/complete', validate(completeLessonSchema), asyncHandler(completeLesson));

export default router;
