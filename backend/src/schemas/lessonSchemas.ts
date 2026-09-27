import { z } from 'zod';

const answerValueSchema = z.string().trim().min(1).max(500);

export const lessonIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const checkExerciseSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid(),
    exerciseId: z.string().uuid()
  }),
  body: z.object({
    answer: answerValueSchema
  })
});

export const completeLessonSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    answers: z.array(
      z.object({
        exerciseId: z.string().uuid(),
        answer: answerValueSchema
      })
    ).min(1),
    durationSeconds: z.number().int().min(0).default(0)
  }).superRefine((value, ctx) => {
    const ids = value.answers.map((answer) => answer.exerciseId);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate exerciseId values are not allowed',
        path: ['answers']
      });
    }
  })
});
