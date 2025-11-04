/**
 * @module ShopTxService
 *
 * @description
 * Handles all shop-level cylinder transactions including exchange operations.
 */

import { Types } from 'mongoose';
import { Errors } from '@/error/index.js';

import { Cylinder, cylinderSanitizers } from '@/feats/cylinderModule/index.js';

import {
  Transaction,
  transactionService,
  transactionSanitizers,
} from '@/feats/transactionModule/index.js';

import { Shop } from '../index.js';
import { shopTxValidator, shopTxConstants } from './index.js';

/**
 * @function clearShopDue
 * @description Handles due clearance for a shop by recording a payment transaction and updating the shop's due balance.
 *
 * @param {Object} dueData - The due clearance data (contains totalAmount and paymentMethod, plus optional ref/details).
 * @param {string} userId - The ID of the user performing the transaction.
 * @param {string} storeId - The ID of the store where the shop belongs.
 * @param {string} shopId - The ID of the shop whose due is being cleared.
 */
export const clearShopDue = async (
  dueData: shopTxValidator.ShopDueInput,
  userId: string,
  storeId: string,
  shopId: string
) => {
  const { totalAmount, paymentMethod, ref, details } = dueData;

  // Validate shop
  const shop = await Shop.findById(shopId);
  if (!shop) throw new Errors.NotFoundError('Shop not found');

  // Check for overpayment
  if (totalAmount > shop.totalDue) throw new Errors.BadRequestError('Payment exceeds due amount');

  // Update shop due
  shop.totalDue -= totalAmount;
  if (shop.totalDue < 0) shop.totalDue = 0; // just to be safe
  await shop.save();

  // Transaction-specific fields
  const txData = {
    category: shopTxConstants.ShopTxCategory.SHOP_DUE_PAYMENT,
    totalAmount,
    paymentMethod,
    counterpartyType: shopTxConstants.ShopCounterpartyKind.SHOP,
    shopId,
    ref,
    details,
  };

  const tx = await transactionService.recordTransaction(txData, userId, storeId);
  return tx;
};

/**
 * @function singleShopTransactions
 * @description Retrieves all transactions for a single shop with pagination.
 *
 * @param {string} storeId - The ID of the store where the shop belongs.
 * @param {string} shopId - The ID of the shop.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of transactions per page.
 */
export const singleShopTransactions = async (
  storeId: string,
  shopId: string,
  page: number,
  limit: number
): Promise<transactionSanitizers.SanitizedTransactions & { total: number }> => {
  const total = await Transaction.countDocuments({
    shopId: new Types.ObjectId(shopId),
    store: new Types.ObjectId(storeId),
  });
  if (total === 0) return { transactions: [], total };

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({
    shopId: new Types.ObjectId(shopId),
    store: new Types.ObjectId(storeId),
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    transactions: transactionSanitizers.allTransactionSanitizer(transactions, [
      'id',
      'totalAmount',
      'transactionType',
      'details',
    ]).transactions,
    total,
  };
};

/**
 * @function allShopTransactions
 * @description Retrieves all shop-related transactions for a store with pagination.
 *
 * @param {string} storeId - The ID of the store.
 * @param {number} page - The page number.
 * @param {number} limit - The number of transactions per page.
 */
export const allShopTransactions = async (
  storeId: string,
  page: number,
  limit: number
): Promise<transactionSanitizers.SanitizedTransactions & { total: number }> => {
  const total = await Transaction.countDocuments({
    store: new Types.ObjectId(storeId),
    counterpartyType: shopTxConstants.ShopCounterpartyKind.SHOP,
  });
  if (total === 0) return { transactions: [], total };

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({
    store: new Types.ObjectId(storeId),
    counterpartyType: shopTxConstants.ShopCounterpartyKind.SHOP,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('shopId', 'shopName ownerName phoneNumber')
    .lean();

  return {
    transactions: transactionSanitizers.allTransactionSanitizer(transactions, [
      'id',
      'totalAmount',
      'transactionType',
      'shopId',
      'details',
    ]).transactions,
    total,
  };
};

/**
 * @function handleCylinderExchangeGasSell
 * @description
 * Handles shop cylinder exchange transactions:
 * - Takes empty cylinders from shop
 * - Gives full cylinders to shop
 * - Updates inventory accordingly
 * - Adjusts shop’s due and payment records
 * - Records financial transaction
 * @param {Object} exchangeData - Data for cylinder exchange transaction
 * @param {string} userId - ID of the user performing the transaction
 * @param {string} storeId - ID of the store
 */
export const handleCylinderExchangeGasSell = async (
  exchangeData: any,
  userId: string,
  storeId: string
) => {
  const {
    shopId,
    cylinders,
    quantity,
    totalPrice,
    paidAmount,
    due,
    paymentMethod,
    vehicleId,
    ref,
    details,
  } = exchangeData;

  // ------------------ Validate Shop ------------------
  const shop = await Shop.findById(shopId);
  if (!shop) throw new Errors.NotFoundError('Shop not found');

  const updatedCylinders: any[] = [];

  let totalIn = 0;
  let totalOut = 0;

  // ------------------ Handle TAKE Cylinders (Empty Received from Shop) ------------------
  for (const c of cylinders.take) {
    const cylinder = await Cylinder.findById(c.id);
    if (!cylinder) throw new Errors.NotFoundError(`Cylinder not found: ${c.id}`);

    cylinder.emptyCount += c.quantity;
    cylinder.updatedBy = new Types.ObjectId(userId);
    await cylinder.save();

    updatedCylinders.push(cylinderSanitizers.cylinderSanitizer(cylinder));
    totalIn += c.quantity;
  }

  // ------------------ Handle GIVE Cylinders (Full Given to Shop) ------------------
  for (const c of cylinders.give) {
    const cylinder = await Cylinder.findById(c.id);
    if (!cylinder) throw new Errors.NotFoundError(`Cylinder not found: ${c.id}`);

    if (cylinder.fullCount < c.quantity)
      throw new Errors.BadRequestError(
        `Not enough full cylinders in stock for ${cylinder.brand} (${c.size}kg)`
      );

    cylinder.fullCount -= c.quantity;
    cylinder.updatedBy = new Types.ObjectId(userId);
    await cylinder.save();

    updatedCylinders.push(cylinderSanitizers.cylinderSanitizer(cylinder));
    totalOut += c.quantity;
  }

  // ------------------ Validate Quantities ------------------
  if (totalIn !== totalOut)
    throw new Errors.BadRequestError('Invalid cylinder exchange operation (mismatched counts)');

  // ------------------ Update Shop Financial Records ------------------
  shop.totalDue += due;
  shop.totalPurchases += totalPrice;
  shop.totalPayments += paidAmount;
  shop.totalDeliveries += quantity;
  shop.updatedBy = new Types.ObjectId(userId);
  await shop.save();

  // ------------------ Record Transaction(s) ------------------
  const baseTxData = {
    quantity,
    totalAmount: totalPrice,
    paymentMethod,
    counterpartyType: shopTxConstants.ShopCounterpartyKind.SHOP,
    shopId,
    vehicleId: vehicleId || '000000000000000000000000', // TODO: Replace with actual vehicle logic
    ref,
    details: {
      due,
      amountPaid: paidAmount,
      cylinders,
      description: details || 'Cylinder exchange with shop',
    },
  };

  const transactions = [];

  // Transaction for the paid amount (cash/bank/mobile)
  if (paidAmount > 0) {
    const paidTxData = {
      ...baseTxData,
      category: shopTxConstants.ShopTxCategory.CYLINDER_EXCHANGE_CASH,
      totalAmount: paidAmount,
      price: totalPrice,
    };
    const paidTx = await transactionService.recordTransaction(paidTxData, userId, storeId);
    transactions.push(paidTx);
  }

  // Transaction for due amount (credit)
  if (due > 0) {
    const dueTxData = {
      ...baseTxData,
      category: shopTxConstants.ShopTxCategory.CYLINDER_EXCHANGE_CREDIT,
      totalAmount: 0,
      price: totalPrice,
    };
    const dueTx = await transactionService.recordTransaction(dueTxData, userId, storeId);
    transactions.push(dueTx);
  }

  return {
    shop,
    transactions,
    updatedCylinders,
  };
};

/**
 * ----------------- Default Exports (shopTxService) -----------------
 */
export default {
  clearShopDue,
  singleShopTransactions,
  allShopTransactions,

  handleCylinderExchangeGasSell,
};
