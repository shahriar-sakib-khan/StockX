/**
 * @module vehicleTx.validation
 *
 * @description
 * Zod validation schemas for vehicle transactions.
 * Includes repair and fuel transactions.
 */

import { z } from 'zod';

import { VehiclePaymentMethod } from './vehicle.tx.constants.js';

/**
 * ----------------- Repair Transaction Schema -----------------
 * @property {number} amount - Required. Amount for the repair transaction.
 * @property {string} [paymentMethod] - Optional. Payment method used.
 * @property {string} [ref] - Optional. Reference for the transaction.
 * @property {Record<string, any>} [details] - Optional. Additional transaction details.
 */
export const repairSchema = z
  .object({
    amount: z.number({ message: 'Amount is required' }),
    paymentMethod: z.enum(VehiclePaymentMethod).optional(),
    ref: z.string().optional(),
    details: z.record(z.string(), z.any()).optional(),
  })
  .strict();

export type RepairTxInput = z.infer<typeof repairSchema>;

/**
 * ----------------- Fuel Transaction Schema -----------------
 * @property {number} amount - Required. Amount for the fuel transaction.
 * @property {string} [paymentMethod] - Optional. Payment method used.
 * @property {string} [ref] - Optional. Reference for the transaction.
 * @property {Record<string, any>} [details] - Optional. Additional transaction details.
 */
export const fuelSchema = repairSchema.strict();
export type FuelTxInput = z.infer<typeof fuelSchema>;
