/**
 * @module cylinder.transaction.validation
 *
 * @description Validation schemas for cylinder transaction operations.
 */

import { z } from 'zod';

import { CylinderPaymentMethod } from './cylinder.tx.constants.js';

/**
 * ----------------- Buy Cylinder -----------------
 * @property {number} quantity - Required. Quantity of cylinders to buy.
 * @property {number} pricePerUnit - Required. Price per unit of cylinders.
 * @property {string} [paymentMethod] - Optional. Payment method used.
 * @property {string} [ref] - Optional. Reference for the transaction.
 * @property {Record<string, any>} [details] - Optional. Additional transaction details.
 */
export const buyCylinderSchema = z
  .object({
    quantity: z.number().positive({ message: 'Quantity must be greater than 0' }),
    pricePerUnit: z.number().positive({ message: 'Price per unit must be greater than 0' }),
    paymentMethod: z.enum(CylinderPaymentMethod).optional(),
    ref: z.string().optional(),
    details: z.record(z.string(), z.any()).optional(),
  })
  .strict();

export type BuyCylinderInput = z.infer<typeof buyCylinderSchema>;

/**
 * ----------------- Sell Cylinder -----------------
 * @property {number} quantity - Required. Quantity of cylinders to sell.
 * @property {number} pricePerUnit - Required. Price per unit of cylinders.
 * @property {string} [ref] - Optional. Reference for the transaction.
 * @property {Record<string, any>} [details] - Optional. Additional transaction details.
 */
export const sellCylinderSchema = buyCylinderSchema.strict();
export type SellCylinderInput = z.infer<typeof sellCylinderSchema>;
