import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().trim().min(1).max(100).nullable().optional(),
    username: z.string().trim().min(3).max(50).optional(),
    timezone: z.string().trim().min(1).max(100).optional(),
    avatarKey: z.string().trim().min(1).max(100).nullable().optional()
  }).refine(
    (value) => Object.keys(value).length > 0,
    { message: 'At least one profile field must be provided' }
  )
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(100)
  }).refine(
    (value) => value.currentPassword !== value.newPassword,
    {
      message: 'New password must be different from current password',
      path: ['newPassword']
    }
  )
});

export const deleteAccountSchema = z.object({
  body: z.object({
    password: z.string().min(1)
  })
});
