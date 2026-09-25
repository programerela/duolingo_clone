import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    displayName: z.string().min(1).max(100).optional(),
    password: z.string().min(8).max(100),
    timezone: z.string().min(1).max(100).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    emailOrUsername: z.string().min(1),
    password: z.string().min(1)
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20)
  })
});
