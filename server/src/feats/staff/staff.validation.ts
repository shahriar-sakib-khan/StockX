/**
 * @module staff.validation
 *
 * @description Validation schemas for staff management, including
 * staff creation, updates, salary plan updates, attendance logging,
 * and payment recording within workspace divisions.
 */

import { z } from 'zod';

/**
 * ----------------- Create Staff -----------------
 * @property {string} name - Required. Staff name.
 * @property {string} [phone] - Required. Valid phone number (7-15 digits, may start with +).
 * @property {string} [role] - Required. Staff role (e.g., Driver, Manager).
 * @property {string} [image] - Optional. Must be a valid URL.
 * @property {number} [salary] - Required. Staff salary plan.
 */
export const staffInputSchema = z
  .object({
    name: z.string().min(1, { message: 'Staff name is required' }),
    phone: z.string().regex(/^\+?[0-9]{11,15}$/, {
      message: 'Phone number must be 11-15 digits and may include a leading +',
    }),

    role: z.string().optional(),
    image: z.string().optional(),

    salary: z.number().positive({ message: 'Salary amount must be greater than 0' }),
  })
  .strict();

export type CreateStaffInput = z.infer<typeof staffInputSchema>;

/**UpdateDivision
 * @description All fields are optional to support partial updates.
 */
export const updateStaffSchema = staffInputSchema.partial();

export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;