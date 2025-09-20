/**
 * @module user.validation
 *
 * @description
 * Validation schemas for user management operations.
 * Includes creating a user and updating user details.
 */

import { z } from 'zod';

/**
 * ----------------- Create User Schema -----------------
 * @property {string} username - Required. Unique username.
 * @property {string} email - Required. User email address.
 * @property {string} password - Required. User password.
 * @property {string} [firstName] - Optional. User first name.
 * @property {string} [lastName] - Optional. User last name.
 * @property {string} [address] - Optional. User address.
 * @property {string} [image] - Optional. User profile image.
 */
export const createUserSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z
      .string()
      .refine(val => /^\S+@\S+\.\S+$/.test(val), { message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),

    firstName: z.string().optional(),
    lastName: z.string().optional(),
    address: z.string().optional(),
    image: z.string().optional(),
  })
  .strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * ----------------- Update User Schema -----------------
 * @description
 * Allows partial updates of user fields.
 */
export const updateUserSchema = createUserSchema.partial();
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
