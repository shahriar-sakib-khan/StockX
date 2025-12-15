import { HydratedDocument } from 'mongoose';

import { ITransaction } from './index.js';

import { resolveRef, listSanitizer, userSanitizer, vehicleSanitizer } from '@/sanitizers/index.js';

export const transactionSanitizer = (
  transaction: ITransaction | HydratedDocument<ITransaction>
) => ({
  id: String(transaction._id),
  store: String(transaction.store),

  category: transaction.category,
  type: transaction.type, // 'income' | 'expense' ...

  amount: transaction.amount,
  paymentMethod: transaction.paymentMethod,

  // Context
  vehicle: resolveRef(transaction.vehicleId, vehicleSanitizer),
  staff: resolveRef(transaction.staffId, userSanitizer),
  shopId: transaction.shopId ? String(transaction.shopId) : null,

  // Metadata
  ref: transaction.ref ?? null,
  details: transaction.details ?? null,
  performedBy: resolveRef(transaction.performedBy, userSanitizer),

  createdAt: transaction.createdAt,
});

export type SanitizedTransaction = ReturnType<typeof transactionSanitizer>;

export const allTransactionSanitizer = (
  transactions: ITransaction[] | HydratedDocument<ITransaction>[],
  fields?: (keyof SanitizedTransaction)[]
) => ({
  transactions: listSanitizer(transactions, transactionSanitizer, fields),
});

export type SanitizedTransactions = ReturnType<typeof allTransactionSanitizer>;
