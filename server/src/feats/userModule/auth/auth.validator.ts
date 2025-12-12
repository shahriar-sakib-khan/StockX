import { z } from 'zod';

/**
 * ----------------- Schemas -----------------
 */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'First name is required' })
      .regex(/^[A-Za-z\s]+$/, { message: 'First name must contain only letters and spaces' })
      .optional(),
    lastName: z
      .string()
      .regex(/^[A-Za-z\s]+$/, { message: 'Last name must contain only letters and spaces' })
      .optional(),
    username: z
      .string()
      .min(3, { message: 'Username must be 3-30 characters' })
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/, { message: 'Alphanumeric and underscores only' })
      .regex(/^(?!_)(?!.*_$).+$/, { message: 'Cannot start or end with underscore' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 chars' })
      .max(100)
      .regex(/[0-9]/, { message: 'Must include at least one number' }),
    address: z.string().min(1).optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    loginIdentifier: z
      .string()
      .min(1, { message: 'Username or Email is required' })
      .refine(
        val => {
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
          const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(val);
          return isEmail || isUsername;
        },
        { message: 'Invalid username or email format' }
      ),
    password: z.string().min(1, { message: 'Password is required' }),
  })
  .strict();

/**
 * ----------------- Types -----------------
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
