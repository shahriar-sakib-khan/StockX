import { z } from 'zod';

/**
 * ----------------- Schemas -----------------
 */

/**
 * @description Set or Update the base monthly salary for a staff member.
 */
export const setSalarySchema = z
  .object({
    amount: z.number().min(0, { message: 'Salary must be a positive number' }),
  })
  .strict();

export type SetSalaryInput = z.infer<typeof setSalarySchema>;
