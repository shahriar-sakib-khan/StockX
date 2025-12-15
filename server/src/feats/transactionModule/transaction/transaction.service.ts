/**
 * @module transaction.service
 *
 * @description Service for recording transactions with transactions.
 */

import { Types } from 'mongoose';

import { TRANSACTION_CONFIG, TxCategoryType } from './transaction.constants.js';

import { Transaction, ITransaction, transactionSanitizers } from './index.js';

import { Errors } from '@/error/index.js';

/**
 * @function recordTransaction
 * @description Records a transaction using the Master Configuration.
 * Does NOT require database lookups for account codes.
 */
export const recordTransaction = async (
  txData: {
    category: TxCategoryType;
    amount: number;
    paymentMethod?: string;
    quantity?: number;
    // Optional Context Fields
    vehicleId?: string;
    staffId?: string;
    shopId?: string;
    customerId?: string;
    cylinderId?: string;
    ref?: string;
    details?: Record<string, any>;
  },
  userId: string,
  storeId: string
): Promise<transactionSanitizers.SanitizedTransaction> => {
  const { category, amount, paymentMethod, details, ...rest } = txData;

  // 1. Validate Category against Code
  const config = TRANSACTION_CONFIG[category];
  if (!config) {
    throw new Errors.BadRequestError(`Invalid transaction category: '${category}'`);
  }

  // 2. Generate Description
  const description = config.descriptionTemplate.replace(
    /\{\{(\w+)\}\}/g,
    (_, key: string) => (txData as any)[key] ?? (details as any)?.[key] ?? ''
  );

  // 3. Construct Object
  const txObj = {
    ...rest,
    store: new Types.ObjectId(storeId),
    category,
    type: config.type, // Derived from Config
    amount,
    paymentMethod: paymentMethod || 'cash',
    performedBy: new Types.ObjectId(userId),
    details: {
      description,
      ...details,
    },
  };

  // 4. Save
  const transaction = await Transaction.create(txObj);

  return transactionSanitizers.transactionSanitizer(transaction);
};

/**
 * @function getAllTransactions
 * @description Retrieves all transactions for a store (Latest first).
 */
export const getAllTransactions = async (storeId: string): Promise<any> => {
  const transactions = await Transaction.find({ store: storeId }).sort({ createdAt: -1 }).lean();

  // [FIX] Cast 'transactions' to satisfy TypeScript.
  // We know the data shape matches, even if the Mongoose methods are missing.
  return transactionSanitizers.allTransactionSanitizer(transactions as unknown as ITransaction[]);
};

export default { recordTransaction, getAllTransactions };
