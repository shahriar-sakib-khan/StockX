import { HydratedDocument } from 'mongoose';

import { resolveRef, listSanitizer, userSanitizer, vehicleSanitizer } from '@/sanitizers/index.js';

import { ITransaction } from './index.js';

/**
 * ----------------- Transaction -----------------
 * Sanitizes a single transaction document
 */
export const transactionSanitizer = (
  transaction: ITransaction | HydratedDocument<ITransaction>
) => ({
  id: String(transaction._id),

  store: String(transaction.store),

  debitAccountId: String(transaction.debitAccountId),
  creditAccountId: String(transaction.creditAccountId),
  amount: transaction.amount,

  category: transaction.category,
  transactionType: transaction.transactionType,
  paymentMethod: transaction.paymentMethod ?? 'cash',

  counterpartyType: transaction.counterpartyType,
  staffId: resolveRef(transaction.staffId ?? null, userSanitizer),
  vehicleId: resolveRef(transaction.vehicleId ?? null, vehicleSanitizer),
  shopId: transaction.shopId ? String(transaction.shopId) : null,
  customerId: transaction.customerId ? String(transaction.customerId) : null,
  cylinderId: resolveRef(transaction.cylinderId ?? null, vehicleSanitizer),

  transactedBy: resolveRef(transaction.transactedBy, userSanitizer),
  ref: transaction.ref ?? null,
  details: transaction.details ?? null,

  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

export type SanitizedTransaction = ReturnType<typeof transactionSanitizer>;

/**
 * ----------------- Transaction List -----------------
 * Sanitizes a list of transactions with optional field selection
 */
export const allTransactionSanitizer = (
  transactions: ITransaction[] | HydratedDocument<ITransaction>[],
  fields?: (keyof SanitizedTransaction)[]
) => ({
  transactions: listSanitizer(transactions, transactionSanitizer, fields),
});

export type SanitizedTransactions = ReturnType<typeof allTransactionSanitizer>;
