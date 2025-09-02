/**
 * @module transactionService
 *
 * @description Service to handle all types of transactions and associated stock movements.
 */

import { Types } from 'mongoose';

import { Account, Transaction, TxCategory } from '@/models';
import { Errors } from '@/error';

/**
 * @function getAllTransactions
 * @description Get all transactions in a division
 *
 * @param {string} divisionId - The ID of the division to retrieve transactions for.
 * @param {string} workspaceId - The ID of the workspace to retrieve transactions for.
 * @returns {Promise<any>} An array of transaction documents.
 */
export const getAllTransactions = async (divisionId: string, workspaceId: string): Promise<any> => {
  const transactions = await Transaction.find({
    workspace: workspaceId,
    division: divisionId,
  }).lean();
  return transactions;
};

export const recordPurchase = async (
  userData: any,
  userId: string,
  divisionId: string,
  workspaceId: string
): Promise<any> => {
  const {
    amount,
    category,
    paymentMethod,
    counterpartyType,
    counterpartyId,
    ref,
    details: otherDetails,
  } = userData;

  const config = await TxCategory.findOne({
    code: category,
    division: divisionId,
    workspace: workspaceId,
  });

  if (!config) throw new Errors.NotFoundError(`Invalid transaction category: ${category}`);

  // Fetch debit & credit accounts
  const debitAccount = await Account.findOne({ code: config.debitAccountCode }).select('_id');
  const creditAccount = await Account.findOne({ code: config.creditAccountCode }).select('_id');
  if (!debitAccount || !creditAccount)
    throw new Errors.NotFoundError('Debit or Credit account not found');

  // Build transaction description
  const description = config.descriptionTemplate?.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => userData[key] ?? ''
  );

  // Create Transaction
  const tx = await Transaction.create({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
    debitAccountId: debitAccount._id,
    creditAccountId: creditAccount._id,
    amount,
    category,
    paymentMethod,
    counterpartyType,
    counterpartyId: counterpartyId ? new Types.ObjectId(counterpartyId) : undefined,
    transactedBy: new Types.ObjectId(userId),
    ref,
    details: { description, otherDetails },
  });

  return tx;
};

export default {
  getAllTransactions,

  recordPurchase,
};
