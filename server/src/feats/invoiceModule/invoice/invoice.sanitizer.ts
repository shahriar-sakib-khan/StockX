import { HydratedDocument } from 'mongoose';

import { IInvoice } from './index.js';

import { listSanitizer, resolveRef, userSanitizer, storeSanitizer } from '@/sanitizers/index.js';

export const invoiceSanitizer = (doc: IInvoice | HydratedDocument<IInvoice>) => ({
  id: String(doc._id),
  invoiceNo: doc.invoiceNo,
  store: resolveRef(doc.store, storeSanitizer),

  // Context
  shopId: doc.shop ? String(doc.shop) : null,
  customerName: doc.customerName || null,

  // Details
  productsSold: doc.productsSold.map(item => ({
    ...item,
    productId: String(item.productId),
  })),
  emptiesReturned: doc.emptiesReturned.map(item => ({
    ...item,
    productId: String(item.productId),
  })),

  // Financials
  totalAmount: doc.totalAmount,
  discount: doc.discount,
  netAmount: doc.netAmount,
  paidAmount: doc.paidAmount,
  dueAmount: doc.dueAmount,
  status: doc.status,

  repayments: doc.repayments.map(r => ({
    date: r.date,
    amount: r.amount,
    collectedBy: resolveRef(r.collectedBy, userSanitizer),
    transactionId: String(r.transactionId),
  })),

  issuedBy: resolveRef(doc.issuedBy, userSanitizer),
  createdAt: doc.createdAt,
});

export type SanitizedInvoice = ReturnType<typeof invoiceSanitizer>;

export const allInvoiceSanitizer = (
  docs: IInvoice[] | HydratedDocument<IInvoice>[],
  fields?: (keyof SanitizedInvoice)[]
) => ({
  invoices: listSanitizer(docs, invoiceSanitizer, fields),
});
