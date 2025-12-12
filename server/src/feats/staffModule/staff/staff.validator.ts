import { z } from 'zod';

/**
 * ----------------- Schemas -----------------
 */

// Manager creating a staff account
export const createStaffSchema = z
  .object({
    // Identity
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters' })
      .regex(/^[a-z0-9_]+$/, { message: 'Username must be lowercase alphanumeric' })
      .trim(),
    password: z.string().min(4, { message: 'Password must be at least 4 characters' }),

    // Profile
    name: z.string().min(1, { message: 'Name is required' }).trim(),
    phone: z.string().min(10, { message: 'Valid phone number required' }).trim(),
    role: z.enum(['manager', 'cashier', 'driver', 'staff']).default('staff'),
    address: z.string().trim().optional(),
    image: z.string().trim().optional(),

    // Config
    baseSalary: z.number().min(0).optional(),
  })
  .strict();

// Manager updating a staff profile
export const updateStaffSchema = z
  .object({
    name: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    role: z.enum(['manager', 'cashier', 'driver', 'staff']).optional(),
    address: z.string().trim().optional(),
    image: z.string().trim().optional(),
    isActive: z.boolean().optional(),
    baseSalary: z.number().min(0).optional(),
    password: z.string().min(4).optional(), // Manager resetting password
  })
  .strict();

// Staff logging in themselves
export const staffLoginSchema = z
  .object({
    storeCode: z.string().min(1, { message: 'Store Code/ID is required' }),
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
  })
  .strict();

/**
 * ----------------- Types -----------------
 */
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type StaffLoginInput = z.infer<typeof staffLoginSchema>;
