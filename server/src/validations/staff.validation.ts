/**
 * @module staff.validation
 *
 * @description Validation schemas for staff management, including
 * staff creation, updates, salary plan updates, attendance logging,
 * and payment recording within workspace divisions.
 */

import { z } from 'zod';

import { constants, txConstants } from '@/common/constants';

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

/**
 * ----------------- Staff Transaction Validation -----------------
 */

/**
 * StaffTransactionInput
 * @property {number} amount - Required. Transaction amount, must be greater than 0.
 * @property {StaffCategoryType} category - Required. Must be one of staff-related categories.
 * @property {PaymentMethodType} [paymentMethod] - Optional. One of 'cash', 'bank', 'mobile', 'due', 'other'.
 * @property {string} [ref] - Optional. Reference string such as invoice or voucher number.
 * @property {object} [details] - Optional. Additional metadata for the transaction.
 *
 * @description
 * Zod schema for validating staff transaction creation input.
 * Ensures all required fields are present, scoped to workspace & division, and category is restricted to staff-related types.
 */
export const staffTransactionSchema = z
  .object({
    amount: z.number().positive({ message: 'Amount must be greater than 0' }),
    category: z.enum(['salary_payment'] as const, {
      message: 'Invalid transaction category',
    }),
    paymentMethod: z.enum(txConstants.PaymentMethod).optional(),
    ref: z.string().optional(),
    details: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type StaffTransactionInput = z.infer<typeof staffTransactionSchema>;
