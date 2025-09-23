import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { recordTransaction } from '@/services/v1/index.js';
import { Transaction } from '@/models/index.js';

import { Cylinder } from '../index.js';
import { cylinderTxValidator } from './index.js';

export const buyCylinder = async (
  userData: cylinderTxValidator.BuyCylinderInput,
  userId: string,
  storeId: string,
  cylinderId: string
) => {
  const { quantity, pricePerUnit } = userData;

  const cylinder = await Cylinder.findById(cylinderId);
  if (!cylinder) throw new Errors.NotFoundError('Cylinder not found');

  // Update stock
  cylinder.count += quantity;
  await cylinder.save();

  // Transaction-specific fields
  const txData = {
    category: 'cylinder-buy',
    amount: quantity * pricePerUnit,
    counterpartyType: 'shop',
    cylinderId,
    quantity,
    pricePerUnit,
  };

  const tx = await recordTransaction(txData, userId, storeId);

  return tx;
};

export const sellCylinder = async (
  userData: cylinderTxValidator.SellCylinderInput,
  userId: string,
  storeId: string,
  cylinderId: string
) => {
  const { quantity, pricePerUnit } = userData;

  const cylinder = await Cylinder.findById(cylinderId);
  if (!cylinder) throw new Errors.NotFoundError('Cylinder not found');
  if (cylinder.count < quantity) throw new Errors.BadRequestError('Insufficient stock');

  // Update stock
  cylinder.count -= quantity;
  await cylinder.save();

  // Transaction-specific fields
  const txData = {
    category: 'cylinder-sale',
    amount: quantity * pricePerUnit,
    counterpartyType: 'customer',
    cylinderId,
    quantity,
  };

  const tx = await recordTransaction(txData, userId, storeId);
  return tx;
};

/**
 * @function allCylinderTransactions
 * @description Retrieves all transactions for a cylinder with pagination
 */
export const allCylinderTransactions = async (
  cylinderId: string,
  page: number,
  limit: number
): Promise<any> => {
  const skip = (page - 1) * limit;

  const total = await Transaction.countDocuments({
    cylinderId: new Types.ObjectId(cylinderId),
  });
  if (total === 0) return { transactions: [], total };

  const transactions = await Transaction.find({
    cylinderId: new Types.ObjectId(cylinderId),
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return { transactions, total };
};

export default {
  buyCylinder, // Purchase a cylinder
  sellCylinder, // Sell a cylinder
  allCylinderTransactions, // Get all cylinder transactions
};
