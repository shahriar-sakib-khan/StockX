import { HydratedDocument } from 'mongoose';

import { ITransaction } from '@/models/index.js';
import {
  resolveRef,
  listSanitizer,
  userSanitizer,
  workspaceSanitizer,
  divisionSanitizer,
  accountSanitizer,
  vehicleSanitizer,
  storeSanitizer,
} from '@/sanitizers/index.js';

/**
 * ----------------- Transaction -----------------
 */
export const transactionSanitizer = (
  transaction: ITransaction | HydratedDocument<ITransaction>
) => ({
  id: String(transaction._id),
  workspace: resolveRef(transaction.workspace ?? null, workspaceSanitizer),
  division: resolveRef(transaction.division ?? null, divisionSanitizer),

  debitAccountId: resolveRef(transaction.debitAccountId ?? null, accountSanitizer),
  creditAccountId: resolveRef(transaction.creditAccountId ?? null, accountSanitizer),
  amount: transaction.amount,

  category: transaction.category,
  paymentMethod: transaction.paymentMethod ?? null,

  counterpartyType: transaction.counterpartyType,
  staff: transaction.staffId ? resolveRef(transaction.staffId, userSanitizer) : null,
  vehicle: transaction.vehicleId ? resolveRef(transaction.vehicleId, vehicleSanitizer) : null,
  store: transaction.storeId ? resolveRef(transaction.storeId, storeSanitizer) : null,
  customer: transaction.customerId ? resolveRef(transaction.customerId, userSanitizer) : null,

  transactedBy: resolveRef(transaction.transactedBy ?? null, userSanitizer),
  ref: transaction.ref ?? null,
  details: transaction.details ?? null,

  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

export type SanitizedTransaction = ReturnType<typeof transactionSanitizer>;

/**
 * ----------------- Transaction List -----------------
 * Can optionally select only specific fields
 */
export const allTransactionSanitizer = (
  transactions: ITransaction[] | HydratedDocument<ITransaction>[],
  fields?: (keyof SanitizedTransaction)[]
) => ({
  transactions: listSanitizer(transactions, transactionSanitizer, fields),
});

export type SanitizedTransactions = ReturnType<typeof allTransactionSanitizer>;
