/**
 * @module cylinder.tx.service
 *
 * @description Services for managing cylinder transactions.
 */

import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { transactionService } from '@/feats/transactionModule/index.js';

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
  const { id: brandId, price, paymentMethod, count, regulatorType, size } = buyData;

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
  cylinder.count += count;
  await cylinder.save();

  // Record transaction
  const txData = {
    category: cylinderTxConstants.CylinderTxCategory.CYLINDER_PURCHASE_WHOLESALE_CASH,
    price,
    count,
    amount: price * count,
    paymentMethod,
    counterpartyType: cylinderTxConstants.CylinderCounterpartyKind.SUPPLIER,
    cylinderId: cylinder._id,
    ref: `Purchase_${Date.now()}`,
    details: {
      regulatorType,
      size,
      brand: brandId,
      count,
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
    amount,
    price,
    count,
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
  cylinder.count -= count;
  await cylinder.save();

  // Build transaction data
  const txData = {
    category: cylinderTxConstants.CylinderTxCategory.CYLINDER_SALE_CASH,
    price,
    count,
    amount,
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
 * @description Marks cylinders as defected and records a transaction for inventory tracking.
 */
export const markDefected = async (
  // defectData: cylinderTxValidator.DefectTxInput,
  defectData: any,
  transactorId: string,
  storeId: string
) => {
  const { id: brandId, problemCount, regulatorType, size } = defectData;

  // Find defected cylinder
  const defectedCylinder = await Cylinder.findOne({
    brand: brandId,
    store: new Types.ObjectId(storeId),
    regulatorType,
    size,
    isFull: true,
    isDefected: true,
  }).select('store brand name regulatorType size count');

  console.log(defectedCylinder);

  if (!defectedCylinder) throw new Errors.NotFoundError('Defected cylinder not found');

  // Find corresponding full cylinder
  const cylinder = await Cylinder.findOne({
    brand: brandId,
    store: new Types.ObjectId(storeId),
    regulatorType,
    size,
    isFull: true,
    isDefected: false,
  })
    .select('count')
    .lean();

  if (!cylinder) throw new Errors.NotFoundError('Cylinder not found');

  // Update inventory
  if (cylinder.count < problemCount)
    throw new Errors.BadRequestError('Not enough cylinders to mark as defected');

  defectedCylinder.updatedBy = new Types.ObjectId(transactorId);
  defectedCylinder.count += problemCount;
  await defectedCylinder.save();

  return cylinderSanitizers.cylinderSanitizer(defectedCylinder);
};

/**
 * @function unmarkDefected
 * @description Marks cylinders as defected and records a transaction for inventory tracking.
 */
export const unmarkDefected = async (
  // defectData: cylinderTxValidator.DefectTxInput,
  nonDefectData: any,
  transactorId: string,
  storeId: string
) => {
  const { id: brandId, problemCount, regulatorType, size } = nonDefectData;

  // Find defected cylinder
  const defectedCylinder = await Cylinder.findOne({
    brand: brandId,
    store: new Types.ObjectId(storeId),
    regulatorType,
    size,
    isFull: true,
    isDefected: true,
  }).select('store brand name regulatorType size count');

  if (!defectedCylinder) throw new Errors.NotFoundError('Defected cylinder not found');

  // Update inventory
  if (defectedCylinder.count < problemCount)
    throw new Errors.BadRequestError('Not enough defected cylinders to unmark');

  defectedCylinder.updatedBy = new Types.ObjectId(transactorId);
  defectedCylinder.count -= problemCount;
  await defectedCylinder.save();

  return cylinderSanitizers.cylinderSanitizer(defectedCylinder);
};

/**
 * ----------------- Exchange: Full-for-Empty -----------------
 */
export const exchangeFullForEmpty = async (
  storeId: string,
  transactorId: string,
  emptyOut: { brandId: string; count: number }[],
  fullIn: { brandId: string; count: number; pricePerGas: number }[],
  paymentMethod: string = 'cash'
): Promise<any> => {
  const totalEmpty = emptyOut.reduce((sum, e) => sum + e.count, 0);
  const totalFull = fullIn.reduce((sum, f) => sum + f.count, 0);
  if (totalEmpty !== totalFull)
    throw new Errors.BadRequestError('Total empty and full cylinders must be equal.');

  // Update inventory
  for (const e of emptyOut) {
    await Cylinder.updateOne(
      { store: storeId, brand: e.brandId, isFull: false },
      { $inc: { count: -e.count } }
    );
  }
  for (const f of fullIn) {
    await Cylinder.updateOne(
      { store: storeId, brand: f.brandId, isFull: true },
      { $inc: { count: f.count } }
    );
  }

  // Calculate total gas cost
  const brandWiseTransactions = fullIn.map(f => ({
    brandId: f.brandId,
    pricePerGas: f.pricePerGas,
    count: f.count,
    amount: f.pricePerGas * f.count,
  }));
  const totalAmount = brandWiseTransactions.reduce((s, b) => s + b.amount, 0);

  // Record as transaction
  await transactionService.recordTransaction(
    {
      category: 'cylinder_swap_retail',
      count: totalFull,
      amount: totalAmount,
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
  cylinderOut: { brandId: string; count: number }[],
  cylinderIn: { brandId: string; count: number }[],
  giverStoreId: string,
  transactorId: string,
  storeId: string
): Promise<any> => {
  const totalOut = cylinderOut.reduce((s, e) => s + e.count, 0);
  const totalIn = cylinderIn.reduce((s, e) => s + e.count, 0);
  if (totalOut !== totalIn)
    throw new Errors.BadRequestError('Total cylinders exchanged must be equal.');

  // Update inventory
  let outgoingCylinders = [];
  for (const c of cylinderOut) {
    const cylinder = await Cylinder.findOne({ store: storeId, brand: c.brandId, isFull: false });
    if (!cylinder) throw new Errors.BadRequestError('Cylinder not found');
    cylinder.count -= c.count;
    await cylinder.save();
    outgoingCylinders.push({ name: cylinder.name, count: c.count });
  }

  let incomingCylinders = [];
  for (const c of cylinderIn) {
    const cylinder = await Cylinder.findOne({ store: storeId, brand: c.brandId, isFull: false });
    if (!cylinder) throw new Errors.BadRequestError('Cylinder not found');
    cylinder.count += c.count;
    await cylinder.save();
    incomingCylinders.push({ name: cylinder.name, count: c.count });
  }

  // Record non-cash transaction recording
  await transactionService.recordTransaction(
    {
      category: 'cylinder_swap_empty',
      count: totalOut,
      amount: 0,
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

export default {
  buyCylinders,
  sellCylinder,

  markDefected,
  unmarkDefected,

  exchangeFullForEmpty,
  exchangeEmptyForEmpty,
};
