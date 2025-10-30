/**
 * @module cylinder.tx.service
 *
 * @description Services for managing cylinder transactions.
 */

import { Types } from 'mongoose';
import { Errors } from '@/error/index.js';

import {
  Transaction,
  transactionService,
  transactionSanitizers,
} from '@/feats/transactionModule/index.js';

import { Cylinder, cylinderSanitizers } from '../index.js';
import { cylinderTxConstants } from './index.js';

/** ----------------- General Cylinder Transactions ----------------- */

/**
 * @function handleCylinderTransaction
 * @description Handles both buying and selling of cylinders.
 * Updates the cylinder inventory and creates a transaction record.
 * Modes:
 * 'buy' → Purchase full cylinders (incoming stock)
 * 'sell' → Sell full cylinders (outgoing stock)
 *
 * @param {Object} txData - Transaction payload (price, quantity, brandId, etc.).
 * @param {number} size - Cylinder size.
 * @param {number} regulatorType - Regulator type.
 * @param {'buy' | 'sell'} mode - Transaction mode.
 * @param {string} transactorId - The ID of the user performing the transaction.
 * @param {string} storeId - The ID of the store.
 */
export const handleCylinderTransaction = async (
  txData: any,
  size: number,
  regulatorType: number,
  mode: 'buy' | 'sell',
  transactorId: string,
  storeId: string
) => {
  const { id, price, quantity, totalAmount, paymentMethod } = txData;

  const cylinder = await Cylinder.findById(id);
  if (!cylinder) throw new Errors.NotFoundError('Cylinder not found for the given parameters');
  if (cylinder.size !== size || cylinder.regulatorType !== regulatorType) {
    throw new Errors.BadRequestError('Invalid cylinder parameters');
  }

  // Update inventory counts
  cylinder.updatedBy = new Types.ObjectId(transactorId);
  if (mode === 'buy') {
    cylinder.fullCount += quantity;
  } else if (mode === 'sell') {
    if (cylinder.fullCount < quantity)
      throw new Errors.BadRequestError('Not enough full cylinders available for sale');
    cylinder.fullCount -= quantity;
  }

  await cylinder.save();

  // Record transaction
  const txRecord = {
    category:
      mode === 'buy'
        ? cylinderTxConstants.CylinderTxCategory.CYLINDER_PURCHASE_WHOLESALE_CASH
        : cylinderTxConstants.CylinderTxCategory.CYLINDER_SALE_CASH,
    price,
    quantity,
    totalAmount,
    paymentMethod,
    counterpartyType:
      mode === 'buy'
        ? cylinderTxConstants.CylinderCounterpartyKind.SUPPLIER
        : cylinderTxConstants.CylinderCounterpartyKind.CUSTOMER,
    cylinderId: cylinder._id,
    ref: `${mode === 'buy' ? 'Purchase' : 'Sale'}_${Date.now()}`,
    details: {
      sku: cylinder.sku,
      regulatorType,
      size,
      pricePerUnit: price,
      quantity,
      totalAmount,
    },
  };
  const tx = await transactionService.recordTransaction(txRecord, transactorId, storeId);

  return { cylinder: cylinderSanitizers.cylinderSanitizer(cylinder), tx };
};

/**
 * @function handleDefectedCylinderMarking
 * @description Marks or unmarks cylinders as defected based on `doMark` flag.
 * If `doMark` is true → mark as defected (increment defected count).
 * If `doMark` is false → unmark defected (decrement defected count).
 * @param {Object} defectData - Defected cylinder data (id, count, regulatorType, size).
 * @param {string} size - Cylinder size.
 * @param {number} regulatorType - Regulator type.
 * @param {boolean} doMark - True to mark as defected, false to unmark.
 * @param {string} transactorId - The ID of the user performing the operation.
 * @param {string} storeId - The ID of the store.
 */
export const handleDefectedCylinderMarking = async (
  defectData: any,
  size: number,
  regulatorType: number,
  doMark: boolean,
  transactorId: string,
  storeId: string
) => {
  const { id, count } = defectData;

  const cylinder = await Cylinder.findById(id);

  if (!cylinder) throw new Errors.NotFoundError('Cylinder record not found');
  if (
    cylinder.store.toString() !== storeId ||
    cylinder.regulatorType !== regulatorType ||
    cylinder.size !== size
  )
    throw new Errors.BadRequestError('Invalid cylinder parameters');

  cylinder.updatedBy = new Types.ObjectId(transactorId);

  if (doMark) {
    if (cylinder.defectedCount + count > cylinder.fullCount + cylinder.emptyCount)
      throw new Errors.BadRequestError('Not enough cylinders to mark as defected');
    cylinder.defectedCount += count;
  } else {
    if (cylinder.defectedCount < count)
      throw new Errors.BadRequestError('Not enough defected cylinders to unmark');
    cylinder.defectedCount -= count;
  }
  await cylinder.save();

  const txRecord = {
    category: cylinderTxConstants.CylinderTxCategory.CYLINDER_SWAP_DEFECTED,
    quantity: count,
    totalAmount: 0,
    paymentMethod: cylinderTxConstants.CylinderPaymentMethod.NON_CASH,
    counterpartyType: cylinderTxConstants.CylinderCounterpartyKind.INTERNAL,
    cylinderId: cylinder._id,
    ref: `${Date.now()}`,
    details: {
      brand: cylinder.brand,
      regulatorType,
      size,
      count,
    },
  };
  const tx = await transactionService.recordTransaction(txRecord, transactorId, storeId);

  return { cylinder: cylinderSanitizers.cylinderSanitizer(cylinder), tx };
};

/**
 * @function exchangeFullForEmpty
 * @description Exchange full cylinders for empty cylinders
 * @param {Array} fullOut - Array of full cylinders to be exchanged
 * @param {Array} emptyIn - Array of empty cylinders to be received
 * @param {string} paymentMethod - Payment method used for the transaction
 * @param {string} transactorId - The ID of the user performing the transaction
 * @param {string} storeId - The ID of the store
 */
export const exchangeFullForEmpty = async (
  fullOut: { brandId: string; quantity: number; pricePerGas: number }[],
  emptyIn: { brandId: string; quantity: number }[],
  paymentMethod: string = 'cash',
  transactorId: string,
  storeId: string
): Promise<any> => {
  const totalEmpty = emptyIn.reduce((sum, e) => sum + e.quantity, 0);
  const totalFull = fullOut.reduce((sum, f) => sum + f.quantity, 0);
  if (totalEmpty !== totalFull)
    throw new Errors.BadRequestError('Total empty and full cylinders must be equal.');

  const brandWiseTransactions = fullOut.map(f => ({
    brandId: f.brandId,
    pricePerGas: f.pricePerGas,
    count: f.quantity,
    totalAmount: f.pricePerGas * f.quantity,
  }));
  const totalAmount = brandWiseTransactions.reduce((s, b) => s + b.totalAmount, 0);

  const txRecord = {
    category: 'cylinder_swap_retail',
    quantity: totalFull,
    totalAmount,
    paymentMethod,
    counterpartyType: 'shop',
    details: {
      brands: brandWiseTransactions,
      note: 'Exchange full cylinders for empty ones with gas pricing.',
    },
  };
  await transactionService.recordTransaction(txRecord, transactorId, storeId);

  return {
    totalAmount,
    brandWiseTransactions,
  };
};

/**
 * @function exchangeEmptyForEmpty
 * @description Exchange empty cylinders between stores
 * @param {Array} cylinderOut
 * @param {Array} cylinderIn
 * @param {string} giverStoreId
 * @param {string} storeId
 * @param {string} transactorId
 */
export const exchangeEmptyForEmpty = async (
  cylinderOut: { brandId: string; quantity: number }[],
  cylinderIn: { brandId: string; quantity: number }[],
  giverStoreId: string,
  storeId: string,
  transactorId: string
): Promise<any> => {
  let outgoingCylinders = [],
    totalOut = 0,
    totalIn = 0;
  for (const c of cylinderOut) {
    const cylinder = await Cylinder.findOne({ store: storeId, brand: c.brandId });

    if (!cylinder) throw new Errors.BadRequestError('Cylinder not found');
    if (cylinder.emptyCount < c.quantity)
      throw new Errors.BadRequestError('Not enough empty cylinders to exchange');

    cylinder.emptyCount -= c.quantity;
    await cylinder.save();
    totalOut += c.quantity;
    outgoingCylinders.push({ brandName: cylinder.brandName, count: c.quantity });
  }

  let incomingCylinders = [];
  for (const c of cylinderIn) {
    const cylinder = await Cylinder.findOne({ store: storeId, brand: c.brandId });

    if (!cylinder) throw new Errors.BadRequestError('Cylinder not found');

    cylinder.emptyCount += c.quantity;
    totalIn += c.quantity;
    await cylinder.save();
    incomingCylinders.push({ brandName: cylinder.brandName, count: c.quantity });
  }

  if (totalOut !== totalIn)
    throw new Errors.BadRequestError('Total cylinders exchanged must be equal.');

  const txRecord = {
    category: cylinderTxConstants.CylinderTxCategory.CYLINDER_SWAP_EMPTY,
    price: 0,
    quantity: totalOut,
    totalAmount: 0,
    paymentMethod: cylinderTxConstants.CylinderPaymentMethod.NON_CASH,
    counterpartyType: cylinderTxConstants.CylinderCounterpartyKind.STORE,
    storeId: giverStoreId,
    ref: `${Date.now()}`,
    details: {
      outgoingCylinders,
      incomingCylinders,
    },
  };
  await transactionService.recordTransaction(txRecord, transactorId, storeId);

  return { outgoingCylinders, incomingCylinders };
};

/** ----------------- Cylinder Transaction History ----------------- */

/**
 * @function allCylinderTransactions
 * @description Retrieves all cylinder-related transactions for a store with pagination
 */
export const allCylinderTransactions = async (
  storeId: string,
  page: number,
  limit: number
): Promise<transactionSanitizers.SanitizedTransactions> => {
  const allCounterpartyKinds = Object.values(cylinderTxConstants.CylinderCounterpartyKind);
  const total = await Transaction.countDocuments({
    store: new Types.ObjectId(storeId),
    counterpartyType: { $in: allCounterpartyKinds },
  });

  if (total === 0) return { transactions: [] };

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({
    store: new Types.ObjectId(storeId),
    counterpartyType: { $in: allCounterpartyKinds },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('cylinderId', 'brandName size regulatorType')
    .lean();

  return {
    transactions: transactionSanitizers.allTransactionSanitizer(transactions, [
      'id',
      'totalAmount',
      'transactionType',
      'category',
      'details',
    ]).transactions,
  };
};

/** ----------------- Default Exports (cylinderTxService) ----------------- */
export default {
  handleCylinderTransaction, // Handles both buying and selling
  handleDefectedCylinderMarking, // Marks or unmarks cylinders as defected

  exchangeFullForEmpty, // Exchange full cylinders for empty ones
  exchangeEmptyForEmpty, // Exchange empty cylinders between stores

  allCylinderTransactions, // Retrieves all cylinder transactions
};
