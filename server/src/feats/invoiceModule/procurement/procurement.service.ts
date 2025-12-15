import { ClientSession, Model } from 'mongoose';

import { ProcurementInput } from './procurement.validator.js';

import { TransactionCategories } from '@/constants/transactionCategories.constants.js';
import { Errors } from '@/error/index.js';
import { Cylinder } from '@/feats/cylinderModule/index.js';
import { Stove, Regulator } from '@/feats/productModule/index.js';
import { transactionService } from '@/feats/transactionModule/index.js';

/**
 * @function handlePackagePurchase
 * @description Buying NEW cylinders (Shell + Gas). Adds to Full Count.
 */
const handlePackagePurchase = async (
  data: ProcurementInput,
  userId: string,
  storeId: string,
  session: ClientSession
) => {
  for (const item of data.items) {
    const cyl = await Cylinder.findOneAndUpdate(
      { _id: item.productId, store: storeId },
      { $inc: { fullCount: item.quantity } },
      { new: true, session }
    );
    if (!cyl) throw new Errors.NotFoundError(`Cylinder brand not found: ${item.productId}`);
  }

  await transactionService.recordTransaction(
    {
      category: TransactionCategories.PURCHASE_PACKAGE,
      amount: data.paidAmount,
      paymentMethod: data.paymentMethod || 'cash',
      details: {
        supplier: data.supplierName,
        items: data.items,
        totalCost: data.totalCost,
        due: data.totalCost - data.paidAmount,
      },
    },
    userId,
    storeId,
    session
  );
};

/**
 * @function handleRefillPurchase
 * @description Refilling: Empty Out -> Full In.
 */
const handleRefillPurchase = async (
  data: ProcurementInput,
  userId: string,
  storeId: string,
  session: ClientSession
) => {
  for (const item of data.items) {
    const cyl = await Cylinder.findOne({ _id: item.productId, store: storeId }).session(session);
    if (!cyl || cyl.emptyCount < item.quantity) {
      throw new Errors.BadRequestError(
        `Insufficient empties for brand ${item.productId}. Have: ${cyl?.emptyCount || 0}`
      );
    }

    await Cylinder.updateOne(
      { _id: item.productId, store: storeId },
      {
        $inc: {
          emptyCount: -item.quantity,
          fullCount: item.quantity,
        },
      },
      { session }
    );
  }

  await transactionService.recordTransaction(
    {
      category: TransactionCategories.PURCHASE_REFILL,
      amount: data.paidAmount,
      paymentMethod: data.paymentMethod || 'cash',
      details: { supplier: data.supplierName, items: data.items, totalCost: data.totalCost },
    },
    userId,
    storeId,
    session
  );
};

/**
 * @function handleProductPurchase
 * @description Buying Products (Stoves/Regulators). Adds to Stock Count.
 */
const handleProductPurchase = async (
  data: ProcurementInput,
  userId: string,
  storeId: string,
  session: ClientSession
) => {
  for (const item of data.items) {
    const ProductModel = (item.productType === 'stove' ? Stove : Regulator) as Model<any>;

    const doc = await ProductModel.findOneAndUpdate(
      { _id: item.productId, store: storeId },
      { $inc: { stockCount: item.quantity } },
      { new: true, session }
    );

    if (!doc) {
      throw new Errors.NotFoundError(`Product (${item.productType}) not found: ${item.productId}`);
    }
  }

  await transactionService.recordTransaction(
    {
      category: TransactionCategories.PURCHASE_PRODUCT,
      amount: data.paidAmount,
      paymentMethod: data.paymentMethod || 'cash',
      details: { supplier: data.supplierName, items: data.items },
    },
    userId,
    storeId,
    session
  );
};

/**
 * @function handleDefectedExchange
 * @description Exchanging Defected Cylinders with Supplier for Full ones.
 * Defected Out -> Full In.
 */
const handleDefectedExchange = async (
  data: ProcurementInput,
  userId: string,
  storeId: string,
  session: ClientSession
) => {
  for (const item of data.items) {
    const cyl = await Cylinder.findOne({ _id: item.productId, store: storeId }).session(session);
    if (!cyl || cyl.defectedCount < item.quantity) {
      throw new Errors.BadRequestError(
        `Insufficient defected stock for brand ${item.productId}. Have: ${cyl?.defectedCount || 0}`
      );
    }

    await Cylinder.updateOne(
      { _id: item.productId, store: storeId },
      {
        $inc: {
          defectedCount: -item.quantity,
          fullCount: item.quantity,
        },
      },
      { session }
    );
  }

  await transactionService.recordTransaction(
    {
      category: 'expense_general', // Or specific category like 'exchange_defected'
      amount: data.paidAmount,
      paymentMethod: data.paymentMethod || 'cash',
      details: {
        note: 'Defected Exchange',
        supplier: data.supplierName,
        items: data.items,
        totalCost: data.totalCost,
      },
    },
    userId,
    storeId,
    session
  );
};

export default {
  handlePackagePurchase,
  handleRefillPurchase,
  handleProductPurchase,
  handleDefectedExchange,
};
