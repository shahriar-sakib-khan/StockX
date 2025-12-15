import { Invoice, invoiceSanitizers } from './index.js';

import { Errors } from '@/error/index.js';

/**
 * @function getInvoiceById
 * @description Fetch a single invoice with full details.
 */
export const getInvoiceById = async (invoiceId: string, storeId: string) => {
  const invoice = await Invoice.findOne({ _id: invoiceId, store: storeId })
    .populate('issuedBy')
    .populate('repayments.collectedBy')
    .lean();

  if (!invoice) throw new Errors.NotFoundError('Invoice not found');

  // Cast needed because we populated fields that are technically IDs in the interface
  return invoiceSanitizers.invoiceSanitizer(invoice as any);
};

/**
 * @function getAllInvoices
 * @description Fetch paginated invoices.
 */
export const getAllInvoices = async (storeId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const total = await Invoice.countDocuments({ store: storeId });
  const invoices = await Invoice.find({ store: storeId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('issuedBy')
    .lean();

  return {
    invoices: invoiceSanitizers.allInvoiceSanitizer(invoices as any, [
      'id',
      'invoiceNo',
      'netAmount',
      'paidAmount',
      'status',
      'shopId',
      'customerName',
      'createdAt',
    ]).invoices,
    total,
  };
};

export default { getInvoiceById, getAllInvoices };
