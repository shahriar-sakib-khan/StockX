/**
 * @module salary.validator
 *
 * @description Validation schemas for division member salary operations.
 * Includes creating salary, updating salary, and recording payments.
 */

import { z } from 'zod';

/**
 * Create Salary
 * @property {number} monthlySalary - Required. Monthly salary amount
 *
 * @description
 * Zod schema for validating salary creation input.
 * Ensures all required fields are present, scoped to workspace & division.
 */
export const createSalarySchema = z
  .object({
    monthlySalary: z.number().positive({ message: 'Monthly salary must be greater than 0' }),
  })
  .strict();

export type CreateSalaryInput = z.infer<typeof createSalarySchema>;

/**
 * Update Salary
 * @description
 * Zod schema for validating salary update input.
 * All fields are optional to allow partial updates.
 */
export const updateSalarySchema = createSalarySchema.partial();
export type UpdateSalaryInput = z.infer<typeof updateSalarySchema>;

/**
 * ----------------- Pay Salary -----------------
 */

/**
 * paySalarySchema
 * @property {number} amount - Payment amount
 * @property {string} [category] - Payment category
 * @property {string} [paymentMethod] - Payment method (cash, bank, mobile, other)
 * @property {string} [ref] - Reference number or invoice number
 * @property {object} [details] - Additional payment details
 *
 * @description
 * Zod schema for validating payment creation input.
 * Ensures all required fields are present, scoped to workspace & division, and category is restricted to 'salary_payment'.
 */
export const paySalarySchema = z
  .object({
    amount: z.number().positive({ message: 'Payment amount must be greater than 0' }),
    category: z.enum(['salary_payment']),
    paymentMethod: z.enum(['cash', 'bank', 'mobile', 'other']),
    ref: z.string().optional(),
    details: z.record(z.string(), z.any()).optional(),
  })
  .strict();

export type PaySalaryInput = z.infer<typeof paySalarySchema>;
