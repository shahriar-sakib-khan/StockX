/**
 * @module transaction.validation
 * 
 * @description Validation schemas for transaction operations.
 */
import z from 'zod';

import { txConstants } from '@/common/constants';

/**
 * TransactionInput
 * @property {number} amount - Required. Must be greater than or equal to 0.
 * @property {TxCategoryType} category - Required. Must be a valid transaction category.
 * @property {PaymentMethodType} [paymentMethod] - Optional. Must be a valid payment method.
 * @property {CounterpartyKindType} counterpartyType - Required. Must be a valid counterparty kind.
 * @property {string} [counterpartyId] - Optional. Must be a valid ObjectId.
 * @property {string} [staffId] - Optional. Must be a valid ObjectId.
 * @property {string} [vehicleId] - Optional. Must be a valid ObjectId.
 * @property {string} [storeId] - Optional. Must be a valid ObjectId.
 * @property {string} [customerId] - Optional. Must be a valid ObjectId.
 * @property {string} [ref] - Optional. Reference number or identifier.
 * @property {object} [details] - Optional. Additional key-value metadata.
 *
 * @description
 * Zod schema for transaction validation.
 * Validates user input on the server side to enforce business rules.
 */
export const transactionSchema = z
  .object({
    amount: z.number().min(0, { message: 'Amount must be greater than or equal to 0' }),

    category: z.enum(txConstants.TransactionCategory, { message: 'Invalid transaction category' }),

    paymentMethod: z.enum(txConstants.PaymentMethod).optional(),

    counterpartyType: z.enum(txConstants.CounterpartyKind, {
      message: 'Invalid counterparty type',
    }),
    counterpartyId: z.string().optional(),

    staffId: z.string().optional(),
    vehicleId: z.string().optional(),
    storeId: z.string().optional(),
    customerId: z.string().optional(),

    ref: z.string().optional(),

    details: z.record(z.string(), z.any()).optional(),
  })
  .strict();
export type TransactionInput = z.infer<typeof transactionSchema>;
