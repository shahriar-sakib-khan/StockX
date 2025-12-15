import { Types, ClientSession } from 'mongoose';

import { Invoice, invoiceSanitizers } from './index.js';

import { TransactionCategories } from '@/constants/transactionCategories.constants.js';
import { Errors } from '@/error/index.js';
import { Shop } from '@/feats/shopModule/index.js';
import { transactionService } from '@/feats/transactionModule/index.js';
import { logger } from '@/utils/index.js';

const generateInvoiceNo = () => `INV-${Date.now().toString().slice(-8)}`;

interface FinancialContext {
  storeId: string;
  userId: string;
  session?: ClientSession;
}

interface InvoiceData {
  items: any[];
  empties: any[];
  financials: {
    discount: number;
    paidAmount: number;
    paymentMethod?: string;
  };
  meta: {
    shopId?: string;
    vehicleId?: string;
    customerName?: string;
    customerPhone?: string;
    channel?: 'b2c_direct' | 'b2b_delivery';
    ref?: string;
  };
}

/**
 * @function generateInvoiceAndTransaction
 * @description Shared logic to create Invoice, Record Cash/Due, and Update Shop stats.
 */
export const generateInvoiceAndTransaction = async (ctx: FinancialContext, data: InvoiceData) => {
  const { storeId, userId, session } = ctx;
  const { items, empties, financials, meta } = data;

  // 1. Calculate Totals
  const totalCalculated = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const netAmount = totalCalculated - financials.discount;
  const dueAmount = netAmount - financials.paidAmount;

  if (dueAmount < 0) throw new Errors.BadRequestError('Paid amount cannot exceed Net amount');

  // 2. Create Invoice Record
  const invoiceNo = generateInvoiceNo();
  const [invoice] = await Invoice.create(
    [
      {
        store: new Types.ObjectId(storeId),
        shop: meta.shopId ? new Types.ObjectId(meta.shopId) : undefined,
        vehicle: meta.vehicleId ? new Types.ObjectId(meta.vehicleId) : undefined,

        customerName: meta.customerName,
        customerPhone: meta.customerPhone,
        channel: meta.channel || 'b2c_direct',

        invoiceNo,
        productsSold: items.map(i => ({ ...i, totalAmount: i.quantity * i.unitPrice })),
        emptiesReturned: empties,

        totalAmount: totalCalculated,
        discount: financials.discount,
        netAmount,
        paidAmount: 0, // Will update via transaction logic below
        dueAmount: netAmount,
        status: 'due',
        issuedBy: new Types.ObjectId(userId),
        repayments: [],
      },
    ],
    { session }
  );

  // 3. Financial Transactions

  // Determine Category Base
  // You should ensure these keys exist in your TransactionCategories constant
  const cashCategory =
    meta.channel === 'b2c_direct'
      ? TransactionCategories.SALE_DIRECT
      : TransactionCategories.SALE_DELIVERY;

  // A. Cash Payment (Income)
  if (financials.paidAmount > 0) {
    const tx = await transactionService.recordTransaction(
      {
        category: cashCategory,
        amount: financials.paidAmount,
        paymentMethod: financials.paymentMethod || 'cash',
        invoiceRef: invoice._id as any,
        shopId: meta.shopId,
        vehicleId: meta.vehicleId,
        details: {
          invoiceNo,
          customer: meta.customerName || 'Shop',
          phone: meta.customerPhone,
        },
      },
      userId,
      storeId,
      session
    );

    // Link repayment to invoice
    invoice.repayments.push({
      amount: financials.paidAmount,
      collectedBy: new Types.ObjectId(userId),
      transactionId: tx.id as any,
      date: new Date(),
    });
    invoice.paidAmount = financials.paidAmount;
    invoice.dueAmount = dueAmount;
  }

  // B. Credit Record (Receivable) - Only for Shops
  if (dueAmount > 0 && meta.shopId) {
    await transactionService.recordTransaction(
      {
        // Using SALE_DELIVERY for credit (Accounts Receivable)
        // Note: Ensure your Transaction Config maps this to Debit AR if needed,
        // or create a separate SALE_CREDIT category.
        category: TransactionCategories.SALE_DELIVERY,
        amount: dueAmount,
        paymentMethod: 'due',
        invoiceRef: invoice._id as any,
        shopId: meta.shopId,
        vehicleId: meta.vehicleId,
        details: { invoiceNo, note: 'Credit added to Shop' },
      },
      userId,
      storeId,
      session
    );

    // Update Shop Profile
    await Shop.findByIdAndUpdate(
      meta.shopId,
      {
        $inc: { totalDue: dueAmount, totalPurchases: netAmount },
      },
      { session }
    );
  }

  // 4. Finalize
  invoice.status = dueAmount === 0 ? 'paid' : financials.paidAmount > 0 ? 'partial' : 'due';
  await invoice.save({ session });

  logger.info(
    `Invoice generated: ${invoiceNo} | Net: ${netAmount} | Phone: ${meta.customerPhone || 'N/A'}`
  );

  return invoiceSanitizers.invoiceSanitizer(invoice as any);
};
