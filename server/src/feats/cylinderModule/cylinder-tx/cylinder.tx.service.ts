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

/**
 * @function buyCylinders
 * @description Records a purchase transaction for cylinders (buy from supplier or stock addition).
 *
 * @param {Object} buyData - The cylinder purchase transaction data.
 * @param {string} transactorId - The ID of the user performing the transaction.
 * @param {string} storeId - The ID of the store.
 */
export const buyCylinders = async (
  // buyData: cylinderTxValidator.BuyTxInput,
  buyData: any,
  transactorId: string,
  storeId: string
) => {
  const { id: brandId, price, quantity, totalAmount, paymentMethod, regulatorType, size } = buyData;

  const cylinder = await Cylinder.findOne({
    brand: brandId,
    store: new Types.ObjectId(storeId),
    regulatorType,
    size,
    isFull: true,
    isDefected: false,
  });

  if (!cylinder) throw new Errors.NotFoundError('Cylinder not found for the given parameters');

  cylinder.updatedBy = new Types.ObjectId(transactorId);
  // Update inventory count
  cylinder.count += quantity;
  await cylinder.save();

  // Record transaction
  const txData = {
    category: cylinderTxConstants.CylinderTxCategory.CYLINDER_PURCHASE_WHOLESALE_CASH,
    price,
    quantity,
    totalAmount,
    paymentMethod,
    counterpartyType: cylinderTxConstants.CylinderCounterpartyKind.SUPPLIER,
    cylinderId: cylinder._id,
    ref: `Purchase_${Date.now()}`,
    details: {
      regulatorType,
      size,
      brand: brandId,
      quantity,
      pricePerUnit: price,
    },
  };

  const tx = await transactionService.recordTransaction(txData, transactorId, storeId);

  return tx;
};

/**
 * @function sellCylinder
 * @description Handles selling (outgoing) full cylinders to customers.
 *
 * @param {Object} sellData - The sale transaction data.
 * @param {string} transactorId - The ID of the user executing the sale.
 * @param {string} storeId - The ID of the store.
 */
export const sellCylinder = async (
  // sellData: cylinderTxValidator.SellTxInput,
  sellData: any,
  transactorId: string,
  storeId: string
) => {
  const {
    id: brandId,
    price,
    quantity,
    totalAmount,
    paymentMethod,
    ref,
    details,
    regulatorType,
    size,
  } = sellData;

  // Find matching full cylinder
  const cylinder = await Cylinder.findOne({
    store: new Types.ObjectId(storeId),
    brand: brandId,
    isFull: true,
    isDefected: false,
    regulatorType,
    size,
  });

  if (!cylinder) throw new Errors.NotFoundError('Full cylinder not found for sale');

  if (cylinder.count <= 0) throw new Errors.BadRequestError('No full cylinders available for sale');

  cylinder.updatedBy = new Types.ObjectId(transactorId);
  // Decrease count of full cylinders
  cylinder.count -= quantity;
  await cylinder.save();

  // Build transaction data
  const txData = {
    category: cylinderTxConstants.CylinderTxCategory.CYLINDER_SALE_CASH,
    price,
    quantity,
    totalAmount,
    paymentMethod,
    counterpartyType: cylinderTxConstants.CylinderCounterpartyKind.CUSTOMER,
    cylinderId: cylinder._id,
    ref,
    details,
  };

  const tx = await transactionService.recordTransaction(txData, transactorId, storeId);
  return tx;
};

/**
 * @function markDefected
 * @description Marks or unmarks cylinders as defected based on `isDefected` flag.
 * If `isDefected` is true → mark as defected (increment defected count).
 * If `isDefected` is false → unmark defected (decrement defected count).
 */
export const markDefected = async (defectData: any, transactorId: string, storeId: string) => {
  const { id: brandId, cylinderCount, regulatorType, size, isDefected } = defectData;

  // Find defected cylinder record
  const defectedCylinder = await Cylinder.findOne({
    brand: brandId,
    store: new Types.ObjectId(storeId),
    regulatorType,
    size,
    isFull: true,
    isDefected: true,
  }).select('store brand name regulatorType size count');

  if (!defectedCylinder) throw new Errors.NotFoundError('Defected cylinder record not found');

  if (isDefected) {
    // --- MARK AS DEFECTED ---
    const fullCylinder = await Cylinder.findOne({
      brand: brandId,
      store: new Types.ObjectId(storeId),
      regulatorType,
      size,
      isFull: true,
      isDefected: false,
    })
      .select('count')
      .lean();

    if (!fullCylinder) throw new Errors.NotFoundError('Full cylinder not found');
    if (fullCylinder.count < cylinderCount)
      throw new Errors.BadRequestError('Not enough cylinders to mark as defected');

    defectedCylinder.updatedBy = new Types.ObjectId(transactorId);
    defectedCylinder.count += cylinderCount;
  } else {
    // --- UNMARK DEFECTED ---
    if (defectedCylinder.count < cylinderCount)
      throw new Errors.BadRequestError('Not enough defected cylinders to unmark');

    defectedCylinder.updatedBy = new Types.ObjectId(transactorId);
    defectedCylinder.count -= cylinderCount;
  }

  await defectedCylinder.save();

  return cylinderSanitizers.cylinderSanitizer(defectedCylinder);
};

/**
 * ----------------- Exchange: Full-for-Empty -----------------
 */
export const exchangeFullForEmpty = async (
  storeId: string,
  transactorId: string,
  emptyOut: { brandId: string; quantity: number }[],
  fullIn: { brandId: string; quantity: number; pricePerGas: number }[],
  paymentMethod: string = 'cash'
): Promise<any> => {
  const totalEmpty = emptyOut.reduce((sum, e) => sum + e.quantity, 0);
  const totalFull = fullIn.reduce((sum, f) => sum + f.quantity, 0);
  if (totalEmpty !== totalFull)
    throw new Errors.BadRequestError('Total empty and full cylinders must be equal.');

  // Update inventory
  for (const e of emptyOut) {
    await Cylinder.updateOne(
      { store: storeId, brand: e.brandId, isFull: false },
      { $inc: { count: -e.quantity } }
    );
  }
  for (const f of fullIn) {
    await Cylinder.updateOne(
      { store: storeId, brand: f.brandId, isFull: true },
      { $inc: { count: f.quantity } }
    );
  }

  // Calculate total gas cost
  const brandWiseTransactions = fullIn.map(f => ({
    brandId: f.brandId,
    pricePerGas: f.pricePerGas,
    count: f.quantity,
    totalAmount: f.pricePerGas * f.quantity,
  }));
  const totalAmount = brandWiseTransactions.reduce((s, b) => s + b.totalAmount, 0);

  // Record as transaction
  await transactionService.recordTransaction(
    {
      category: 'cylinder_swap_retail',
      quantity: totalFull,
      totalAmount: totalAmount,
      paymentMethod,
      counterpartyType: 'shop',
      details: {
        brands: brandWiseTransactions,
        note: 'Exchange empty cylinders for full ones with gas pricing.',
      },
    },
    transactorId,
    storeId
  );

  return {
    message: 'Full-for-empty exchange completed successfully',
    totalAmount,
    brandWiseTransactions,
  };
};

/**
 * ----------------- Exchange: Empty-for-Empty (Inter-store) -----------------
 */
export const exchangeEmptyForEmpty = async (
  cylinderOut: { brandId: string; quantity: number }[],
  cylinderIn: { brandId: string; quantity: number }[],
  giverStoreId: string,
  transactorId: string,
  storeId: string
): Promise<any> => {
  const totalOut = cylinderOut.reduce((s, e) => s + e.quantity, 0);
  const totalIn = cylinderIn.reduce((s, e) => s + e.quantity, 0);
  if (totalOut !== totalIn)
    throw new Errors.BadRequestError('Total cylinders exchanged must be equal.');

  // Update inventory
  let outgoingCylinders = [];
  for (const c of cylinderOut) {
    const cylinder = await Cylinder.findOne({ store: storeId, brand: c.brandId, isFull: false });
    if (!cylinder) throw new Errors.BadRequestError('Cylinder not found');
    cylinder.count -= c.quantity;
    await cylinder.save();
    outgoingCylinders.push({ name: cylinder.name, count: c.quantity });
  }

  let incomingCylinders = [];
  for (const c of cylinderIn) {
    const cylinder = await Cylinder.findOne({ store: storeId, brand: c.brandId, isFull: false });
    if (!cylinder) throw new Errors.BadRequestError('Cylinder not found');
    cylinder.count += c.quantity;
    await cylinder.save();
    incomingCylinders.push({ name: cylinder.name, count: c.quantity });
  }

  // Record non-cash transaction recording
  await transactionService.recordTransaction(
    {
      category: 'cylinder_swap_empty',
      quantity: totalOut,
      totalAmount: 0,
      counterpartyType: 'other',
      details: {
        giverStoreId,
        storeId,
        note: 'Exchange of empty cylinders between stores',
      },
    },
    transactorId,
    storeId
  );

  return {
    outgoingCylinders,
    incomingCylinders,
  };
};

/** ----------------- Cylinder transaction history ----------------- */

/**
 * @function allCylinderTransactions
 * @description Retrieves all cylinder-related transactions for a store with pagination
 */
export const allCylinderTransactions = async (
  storeId: string,
  page: number,
  limit: number
): Promise<transactionSanitizers.SanitizedTransactions & { total: number }> => {
  // Get all possible counterparty kinds (e.g., CUSTOMER, SUPPLIER, STORE.)
  const allCounterpartyKinds = Object.values(cylinderTxConstants.CylinderCounterpartyKind);

  const total = await Transaction.countDocuments({
    store: new Types.ObjectId(storeId),
    counterpartyType: { $in: allCounterpartyKinds },
  });

  if (total === 0) return { transactions: [], total };

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({
    store: new Types.ObjectId(storeId),
    counterpartyType: { $in: allCounterpartyKinds },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('cylinderId', 'brand name size regulatorType')
    .lean();

  return {
    transactions: transactionSanitizers.allTransactionSanitizer(transactions, [
      'id',
      'totalAmount',
      'transactionType',
      'category',
      'details',
    ]).transactions,
    total,
  };
};

/** ----------------- Default Exports (cylinderTxService) ----------------- */
export default {
  buyCylinders,
  sellCylinder,

  markDefected,

  exchangeFullForEmpty,
  exchangeEmptyForEmpty,

  allCylinderTransactions,
};
