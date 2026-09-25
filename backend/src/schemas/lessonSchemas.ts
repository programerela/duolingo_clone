import { z } from 'zod';

export const lessonIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const completeLessonSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    correctAnswers: z.number().int().min(0),
    totalQuestions: z.number().int().positive(),
    durationSeconds: z.number().int().min(0).default(0),
    energyStart: z.number().int().min(0).optional(),
    energyEnd: z.number().int().min(0).optional()
  }).refine(
    (value) => value.correctAnswers <= value.totalQuestions,
    {
      message: 'correctAnswers cannot exceed totalQuestions',
      path: ['correctAnswers']
    }
  )
});
