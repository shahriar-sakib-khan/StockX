/**
 * @module cylinder.transaction.validation
 *
 * @description Validation schemas for cylinder transaction operations.
 */

import { z } from 'zod';
import { CylinderPaymentMethod } from './cylinder.tx.constants.js';

/**
 * ----------------- Common Fields -----------------
 */
const baseCylinderTxSchema = {
  amount: z.number().positive({ message: 'Amount must be greater than 0' }),
  paymentMethod: z.enum(CylinderPaymentMethod).optional(),
  ref: z.string().optional(),
  details: z.record(z.string(), z.any()).optional(),
  regulatorType: z.string().nonempty({ message: 'Regulator type is required' }),
  size: z.union([z.number().positive(), z.string().nonempty()]), // allow numeric or string-based size
};

/**
 * ----------------- Buy Cylinder -----------------
 * @property {number} amount - Total purchase amount.
 * @property {string} regulatorType - Regulator type of the cylinder (from query).
 * @property {number|string} size - Cylinder size (from query).
 * @property {string} [paymentMethod] - Payment method used.
 * @property {string} [ref] - Optional. Reference for the transaction.
 * @property {Record<string, any>} [details] - Optional. Additional transaction details.
 */
export const buyCylinderSchema = z
  .object({
    ...baseCylinderTxSchema,
  })
  .strict();

export type BuyCylinderInput = z.infer<typeof buyCylinderSchema>;

/**
 * ----------------- Sell Cylinder -----------------
 * @property {number} amount - Total sale amount.
 * @property {string} regulatorType - Regulator type of the cylinder (from query).
 * @property {number|string} size - Cylinder size (from query).
 * @property {string} [paymentMethod] - Payment method used.
 * @property {string} [ref] - Optional. Reference for the transaction.
 * @property {Record<string, any>} [details] - Optional. Additional transaction details.
 */
export const sellCylinderSchema = z
  .object({
    ...baseCylinderTxSchema,
  })
  .strict();

export type SellCylinderInput = z.infer<typeof sellCylinderSchema>;

/**
 * ----------------- Add Defected Cylinder -----------------
 * @property {number} amount - Optional. Cost or compensation amount for the defected cylinder.
 * @property {string} regulatorType - Regulator type of the cylinder (from query).
 * @property {number|string} size - Cylinder size (from query).
 * @property {string} [ref] - Optional. Reference for the transaction.
 * @property {Record<string, any>} [details] - Optional. Additional transaction details.
 */
export const addDefectedCylinderSchema = z
  .object({
    amount: z.number().min(0).default(0),
    ref: z.string().optional(),
    details: z.record(z.string(), z.any()).optional(),
    regulatorType: z.string().nonempty(),
    size: z.union([z.number().positive(), z.string().nonempty()]),
  })
  .strict();

export type AddDefectedCylinderInput = z.infer<typeof addDefectedCylinderSchema>;

/**
 * ----------------- Exchange Cylinder -----------------
 * @property {number} amount - Optional. Exchange adjustment amount.
 * @property {string} regulatorType - Regulator type of the cylinder (from query).
 * @property {number|string} size - Cylinder size (from query).
 * @property {string} [ref] - Optional. Reference for the transaction.
 * @property {Record<string, any>} [details] - Optional. Additional transaction details.
 */
export const exchangeCylinderSchema = z
  .object({
    amount: z.number().min(0).default(0),
    ref: z.string().optional(),
    details: z.record(z.string(), z.any()).optional(),
    regulatorType: z.string().nonempty(),
    size: z.union([z.number().positive(), z.string().nonempty()]),
  })
  .strict();

export type ExchangeCylinderInput = z.infer<typeof exchangeCylinderSchema>;
