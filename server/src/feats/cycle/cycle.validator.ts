/**
 * @module cycle.validation
 *
 * @description Validation schemas for salary cycle management.
 * Handles starting new cycles and closing existing cycles.
 */

import { z } from 'zod';

/**
 * ----------------- Create Cycle -----------------
 * @property {number} month - Required. 1-12 representing the month.
 * @property {number} year - Required. Four-digit year (e.g., 2025).
 */
export const createCycleSchema = z
  .object({
    month: z
      .number()
      .min(1, { message: 'Month must be between 1 and 12' })
      .max(12, { message: 'Month must be between 1 and 12' }),
    year: z
      .number()
      .min(1000, { message: 'Year must be at least 1000' })
      .max(9999, { message: 'Year must be reasonable and less than 9999' }),
  })
  .strict();

export type CreateCycleInput = z.infer<typeof createCycleSchema>;

/**
 * ----------------- Close Cycle -----------------
 * Currently no body fields needed, but keep schema for consistency.
 */
export const closeCycleSchema = z.object({}).strict();

export type CloseCycleInput = z.infer<typeof closeCycleSchema>;
