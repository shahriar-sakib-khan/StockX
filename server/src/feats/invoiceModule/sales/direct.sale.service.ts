import { ClientSession, Model } from 'mongoose';

import { generateInvoiceAndTransaction } from '../invoice/invoice.helper.js';

import { Errors } from '@/error/index.js';
import { Cylinder } from '@/feats/cylinderModule/index.js';
import { Regulator, Stove } from '@/feats/productModule/index.js';

interface B2CInput {
  customerName: string;
  customerPhone?: string;
  items: any[];
  empties?: any[];
  discount: number;
  paidAmount: number;
  paymentMethod?: string;
  ref?: string;
}

export const createB2CSale = async (
  data: B2CInput,
  userId: string,
  storeId: string,
  session?: ClientSession
) => {
  const { items, empties = [], ...financials } = data;
  const validatedItems: any[] = [];

  // 1. Inventory Deduction & Price Verification
  for (const item of items) {
    let dbPrice = 0;

    if (item.productType === 'cylinder' || item.productType === 'gas') {
      const cyl = await Cylinder.findOneAndUpdate(
        { _id: item.productId, store: storeId, fullCount: { $gte: item.quantity } },
        { $inc: { fullCount: -item.quantity } },
        { new: true, session }
      );
      if (!cyl) throw new Errors.BadRequestError(`Insufficient Store Stock: ${item.name}`);
      dbPrice = cyl.price;
    } else {
      const ProductModel = (item.productType === 'stove' ? Stove : Regulator) as Model<any>;

      const doc = await ProductModel.findOneAndUpdate(
        { _id: item.productId, store: storeId, stockCount: { $gte: item.quantity } },
        { $inc: { stockCount: -item.quantity } },
        { new: true, session }
      );

      if (!doc) throw new Errors.BadRequestError(`Insufficient Store Stock: ${item.name}`);
      dbPrice = doc.price;
    }
    validatedItems.push({ ...item, unitPrice: dbPrice });
  }

  // 2. Inventory Addition (Empties)
  for (const item of empties) {
    await Cylinder.findOneAndUpdate(
      { _id: item.productId, store: storeId },
      { $inc: { emptyCount: item.quantity } },
      { session }
    );
  }

  // 3. Generate Invoice
  return await generateInvoiceAndTransaction(
    { storeId, userId, session },
    {
      items: validatedItems,
      empties,
      financials: {
        discount: financials.discount,
        paidAmount: financials.paidAmount,
        paymentMethod: financials.paymentMethod,
      },
      meta: {
        customerName: financials.customerName,
        customerPhone: financials.customerPhone,
        channel: 'b2c_direct',
        ref: financials.ref,
      },
    }
  );
};

export default { createB2CSale };
