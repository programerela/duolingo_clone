import { Router } from 'express';
import {
  activateCourse,
  getCoursePath,
  listCourses
} from '../controllers/courseController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { courseIdParamsSchema } from '../schemas/courseSchemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(listCourses));
router.post('/:id/activate', validate(courseIdParamsSchema), asyncHandler(activateCourse));
router.get('/:id/path', validate(courseIdParamsSchema), asyncHandler(getCoursePath));

export default router;
