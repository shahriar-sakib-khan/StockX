/**
 * @module transaction.service
 *
 * @description Service for recording transactions with transactions.
 */

import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { TxCategory, Account } from '@/models/index.js';

import { Transaction, transactionSanitizers } from './index.js';

/**
 * @function recordTransaction
 * @description Records a transaction with transactions.
 *
 * @param {Object} txData - The data for the transaction.
 * @param {string} transactorId - The ID of the transactor.
 * @param {string} storeId - The ID of the store.
 * @returns {Promise<transactionSanitizers.SanitizedTransaction>} The recorded transaction.
 */
export const recordTransaction = async (
  txData: Record<string, any>,
  transactorId: string,
  storeId: string
): Promise<transactionSanitizers.SanitizedTransaction> => {
  const {
    category, // must exist, used to figure out debit/credit
    price,
    quantity,
    totalAmount,
    paymentMethod,

    counterpartyType,
    cylinderId,
    staffId,
    vehicleId,
    customerId,

    ref,
    ...otherDetails // transaction-specific fields from domain service
  } = txData;

  // Fetch category config
  const config = await TxCategory.findOne({ store: storeId, code: category });
  if (!config) throw new Errors.NotFoundError(`Transaction category '${category}' not found`);

  // Resolve accounts
  const debitAccount = await Account.findOne({ code: config.debitAccountCode, store: storeId });
  const creditAccount = await Account.findOne({ code: config.creditAccountCode, store: storeId });
  if (!debitAccount || !creditAccount)
    throw new Errors.NotFoundError(`Debit or Credit account missing for '${config}'`);

  // Build transaction description
  const description = config.descriptionTemplate?.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => txData[key] ?? ''
  );

  // Construct transaction object
  const txObj: any = {
    store: new Types.ObjectId(storeId),
    debitAccountId: debitAccount._id,
    creditAccountId: creditAccount._id,
    price,
    quantity,
    totalAmount,
    category,
    transactionType: config.categoryType,
    paymentMethod: paymentMethod ?? 'cash',
    counterpartyType,
    cylinderId,
    staffId,
    vehicleId,
    customerId,
    ref,
    details: { description, ...otherDetails },
    transactedBy: new Types.ObjectId(transactorId),
  };

  // Remove undefined fields
  Object.keys(txObj).forEach(k => txObj[k] === undefined && delete txObj[k]);

  // Save transaction
  const transaction = await Transaction.create(txObj);

  return transactionSanitizers.transactionSanitizer(transaction);
};

/**
 * @function getAllTransactions
 * @description Retrieves all transactions for a store
 *
 * @param {string} storeId - The ID of the store
 * @returns {Promise<transactionSanitizers.SanitizedTransactions>} All transactions
 */
export const getAllTransactions = async (storeId: string): Promise<any> => {
  const transactions = await Transaction.find({ store: storeId }).lean();

  return transactionSanitizers.allTransactionSanitizer(transactions);
};

export default { recordTransaction, getAllTransactions };
