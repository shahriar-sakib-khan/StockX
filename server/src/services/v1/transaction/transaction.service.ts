/**
 * @module transactionService
 *
 * @description Service to handle all types of transactions and associated stock movements.
 */

import { Types } from 'mongoose';

import { Account, ITransaction, Transaction, TxCategory } from '@/models/index.js';
import { transactionSanitizers, txCategorySanitizers } from '@/sanitizers/index.js';
import { Errors } from '@/error/index.js';

/**
 * ----------------- Transactions Generals -----------------
 */
/**
 * @function getAllTransactions
 * @description Get all transactions in a division
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of transactions to retrieve per page.
 * @param {string} divisionId - The ID of the division to retrieve transactions for.
 * @param {string} workspaceId - The ID of the workspace to retrieve transactions for.
 * @returns {Promise<transactionSanitizers.SanitizedTransactions & { total: number }>} An array of transaction documents.
 */
export const getAllTransactions = async (
  page: number,
  limit: number,
  workspaceId: string,
  divisionId: string
): Promise<transactionSanitizers.SanitizedTransactions & { total: number }> => {
  const total: number = await Transaction.countDocuments({
    workspace: workspaceId,
    division: divisionId,
  });
  if (total === 0) return { transactions: [], total };

  const skip: number = (page - 1) * limit;
  const transactions = await Transaction.find({
    workspace: workspaceId,
    division: divisionId,
  })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    transactions: transactionSanitizers.allTransactionSanitizer(transactions, [
      'id',
      'amount',
      'category',
      'counterpartyType',
      'counterpartyType',
      'paymentMethod',
      'createdAt',
      'transactedBy',
    ]).transactions,
    total,
  };
};

/**
 * @function getSingleTransaction
 * @description Get a single transaction by ID.
 *
 * @param {string} workspaceId - The ID of the workspace to retrieve transactions for.
 * @param {string} divisionId - The ID of the division to retrieve transactions for.
 * @param {string} transactionId - The ID of the transaction to retrieve.
 * @returns {Promise<transactionSanitizers.SanitizedTransaction>} The transaction document.
 */
export const getSingleTransaction = async (
  workspaceId: string,
  divisionId: string,
  transactionId: string
): Promise<transactionSanitizers.SanitizedTransaction> => {
  const transaction = await Transaction.findOne({
    workspace: workspaceId,
    division: divisionId,
    _id: transactionId,
  })
    .populate('workspace', 'id name')
    .populate('division', 'id name')
    .populate('transactedBy', 'id username')
    .populate('staffId', 'id username')
    .populate('customerId', 'id username')
    .populate('storeId', 'id name')
    .populate('vehicleId', 'id regNumber')
    .lean();

  if (!transaction) throw new Errors.NotFoundError('Transaction not found');

  return transactionSanitizers.transactionSanitizer(transaction);
};

/**
 * @function recordTransaction
 * @description Record a new transaction.
 *
 * @param {string} transactorId - The ID of the user who is recording the transaction.
 * @param {string} workspaceId - The ID of the workspace to record the transaction in.
 * @param {string} divisionId - The ID of the division to record the transaction in.
 * @param {object} userData - The data to record the transaction with.
 * @returns {Promise<transactionSanitizers.SanitizedTransaction>} The transaction document.
 */
export const recordTransaction = async (
  transactorId: string,
  workspaceId: string,
  divisionId: string,
  userData: any
): Promise<ITransaction> => {
  const {
    amount,
    category,
    paymentMethod,
    counterpartyType,
    staffId,
    vehicleId,
    storeId,
    customerId,
    ref,
    details: otherDetails,
  } = userData;

  // Get transaction config
  const config = await TxCategory.findOne({
    code: category,
    division: divisionId,
    workspace: workspaceId,
  });
  if (!config) throw new Errors.NotFoundError(`Invalid transaction category: ${category}`);

  // Get debit and credit accounts
  const debitAccount = await Account.findOne({
    code: config.debitAccountCode,
    workspace: workspaceId,
    division: divisionId,
  }).select('_id');

  const creditAccount = await Account.findOne({
    code: config.creditAccountCode,
    workspace: workspaceId,
    division: divisionId,
  }).select('_id');
  if (!debitAccount || !creditAccount)
    throw new Errors.NotFoundError('Debit or Credit account not found');

  // Build transaction description
  const description = config.descriptionTemplate?.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => userData[key] ?? ''
  );

  // Optional fields for transaction and remove null values
  const optionalFields = {
    staffId,
    vehicleId,
    storeId,
    customerId,
    ref,
  };

  const cleanOptionalFields = Object.fromEntries(
    Object.entries(optionalFields).filter(([_, value]) => value != null)
  );

  // Create Transaction
  const tx = await Transaction.create({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
    debitAccountId: debitAccount._id,
    creditAccountId: creditAccount._id,
    amount,
    category,
    paymentMethod: paymentMethod ?? 'cash',
    counterpartyType,
    ...cleanOptionalFields,
    transactedBy: new Types.ObjectId(transactorId),
    details: { description, ...otherDetails },
  });

  return tx;
};

/**
 * ----------------- Transaction Categories -----------------
 */

/**
 * @function getAllTxCategories
 * @description Get all transaction categories in a division
 *
 * @param {string} workspaceId - The ID of the workspace to retrieve transactions for.
 * @param {string} divisionId - The ID of the division to retrieve transactions for.
 * @returns {Promise<txCategorySanitizers.SanitizedTxCategories>} An array of transaction category documents.
 */
export const getAllTxCategories = async (
  workspaceId: string,
  divisionId: string
): Promise<txCategorySanitizers.SanitizedTxCategories> => {
  const categories = await TxCategory.find({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  })
    .select('name code')
    .lean();

  return txCategorySanitizers.allTxCategorySanitizer(categories, ['name', 'code']);
};

/**
 * ----------------- Default export (transactionService) -----------------
 */
export default {
  getAllTransactions,
  getSingleTransaction,

  recordTransaction,

  getAllTxCategories,
};
