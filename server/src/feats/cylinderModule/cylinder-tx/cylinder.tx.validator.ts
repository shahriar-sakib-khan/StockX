/**
 * @module cylinder.transaction.validation
 *
 * @description Validation schemas for cylinder transaction operations.
 */

import { z } from 'zod';

/**
 * ----------------- Buy Cylinder -----------------
 * @property {number} quantity - Required. Quantity of cylinders to buy.
 * @property {number} pricePerUnit - Required. Price per unit of cylinders.
 */
export const buyCylinderSchema = z
  .object({
    quantity: z.number().positive({ message: 'Quantity must be greater than 0' }),
    pricePerUnit: z.number().positive({ message: 'Price per unit must be greater than 0' }),
  })
  .strict();

export type BuyCylinderInput = z.infer<typeof buyCylinderSchema>;

/**
 * ----------------- Sell Cylinder -----------------
 * @property {number} quantity - Required. Quantity of cylinders to sell.
 * @property {number} pricePerUnit - Required. Price per unit of cylinders.
 */
export const sellCylinderSchema = buyCylinderSchema.strict();
export type SellCylinderInput = z.infer<typeof sellCylinderSchema>;
