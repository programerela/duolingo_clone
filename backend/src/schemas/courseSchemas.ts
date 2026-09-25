import { z } from 'zod';

export const courseIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
