import { z } from 'zod';

/**
 * ----------------- Schemas -----------------
 */

export const createUserSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }).trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    address: z.string().trim().optional(),
    image: z.string().url().optional().or(z.literal('')),
  })
  .strict();

export const updateUserSchema = createUserSchema.partial().omit({ password: true }); // Password updates usually handled via separate route

/**
 * ----------------- Types -----------------
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
