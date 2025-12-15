/**
 * @module transaction.service
 * @description Service for recording transactions with transactions.
 */

import { Types, ClientSession } from 'mongoose';

import { TRANSACTION_CONFIG, TxCategoryType } from './transaction.constants.js';

import { Transaction, ITransaction, transactionSanitizers } from './index.js';

import { Errors } from '@/error/index.js';
import { logger } from '@/utils/index.js'; // Ensure logger is imported

/**
 * @function recordTransaction
 * @description Records a transaction using the Master Configuration.
 */
export const recordTransaction = async (
  txData: {
    category: TxCategoryType;
    amount: number;
    paymentMethod?: string;
    quantity?: number;
    // Context Fields
    vehicleId?: string;
    staffId?: string;
    shopId?: string;
    customerId?: string;
    cylinderId?: string;
    invoiceRef?: string | Types.ObjectId;
    ref?: string;
    details?: Record<string, any>;
  },
  userId: string,
  storeId: string,
  session?: ClientSession
): Promise<transactionSanitizers.SanitizedTransaction> => {
  const { category, amount, paymentMethod, details, invoiceRef, ...rest } = txData;

  // 1. Validate Category
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
    type: config.type,
    amount,
    paymentMethod: paymentMethod || 'cash',
    performedBy: new Types.ObjectId(userId),
    invoiceRef: invoiceRef ? new Types.ObjectId(invoiceRef) : undefined,
    details: {
      description,
      ...details,
    },
  };

  // 4. Save with Session (Atomic)
  const [transaction] = await Transaction.create([txObj], { session });

  return transactionSanitizers.transactionSanitizer(transaction);
};

/**
 * @function getAllTransactions
 * @description Retrieves all transactions for a store (Latest first).
 */
export const getAllTransactions = async (storeId: string): Promise<any> => {
  const transactions = await Transaction.find({ store: storeId }).sort({ createdAt: -1 }).lean();

  return transactionSanitizers.allTransactionSanitizer(transactions as unknown as ITransaction[]);
};

/**
 * @function removeAllTransactions
 * @description Deletes all transactions for a specific store (Cascading Delete).
 */
export const removeAllTransactions = async (
  storeId: string,
  session?: ClientSession
): Promise<void> => {
  const result = await Transaction.deleteMany({ store: storeId }, { session });
  logger.info(`[Cleanup] Deleted ${result.deletedCount} transactions for store ${storeId}`);
};

export default { recordTransaction, getAllTransactions, removeAllTransactions };
