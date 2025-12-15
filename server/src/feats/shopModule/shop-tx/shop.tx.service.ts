import { ClientSession } from 'mongoose';

import { Shop } from '../index.js';

import { shopTxValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { Cylinder } from '@/feats/cylinderModule/index.js';
import { transactionService } from '@/feats/transactionModule/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function clearShopDue
 * @description Records a payment to clear a shop's due balance.
 */
export const clearShopDue = async (
  data: shopTxValidator.ShopDueInput,
  userId: string,
  storeId: string,
  shopId: string,
  session?: ClientSession
) => {
  const { totalAmount, paymentMethod, ref, details } = data;

  const shop = await Shop.findOne({ _id: shopId, store: storeId }).session(session || null);
  if (!shop) throw new Errors.NotFoundError('Shop not found');

  if (totalAmount > shop.totalDue) {
    throw new Errors.BadRequestError('Payment amount exceeds current due');
  }

  // 1. Update Shop
  shop.totalDue -= totalAmount;
  shop.totalPayments += totalAmount;
  await shop.save();

  // 2. Record Transaction
  const tx = await transactionService.recordTransaction(
    {
      category: 'shop_due_payment',
      amount: totalAmount,
      paymentMethod,
      shopId,
      ref,
      details,
    },
    userId,
    storeId
  );

  logger.info(`Shop Due Cleared: ${totalAmount} for ${shop.shopName}`);

  return tx;
};

/**
 * @function handleCylinderExchange
 * @description Complex transaction: Updates Inventory (Give/Take), Shop Stats, and Financial Logs.
 */
export const handleCylinderExchange = async (
  data: shopTxValidator.CylinderExchangeInput,
  userId: string,
  storeId: string,
  session?: ClientSession
) => {
  const { shopId, cylinders, totalPrice, paidAmount, due, paymentMethod, vehicleId, ref, details } =
    data;

  const shop = await Shop.findOne({ _id: shopId, store: storeId }).session(session || null);
  if (!shop) throw new Errors.NotFoundError('Shop not found');

  // 1. Inventory Updates
  // GIVE (Full -> Out)
  for (const item of cylinders.give) {
    const cyl = await Cylinder.findOneAndUpdate(
      { _id: item.id, store: storeId, fullCount: { $gte: item.quantity } },
      { $inc: { fullCount: -item.quantity } },
      { new: true, session }
    );
    if (!cyl) throw new Errors.BadRequestError(`Insufficient stock for cylinder ID: ${item.id}`);
  }

  // TAKE (Empty -> In)
  for (const item of cylinders.take) {
    await Cylinder.findOneAndUpdate(
      { _id: item.id, store: storeId },
      { $inc: { emptyCount: item.quantity } },
      { session }
    );
  }

  // 2. Update Shop Financials
  shop.totalPurchases += totalPrice;
  shop.totalPayments += paidAmount;
  shop.totalDue += due;
  shop.totalDeliveries += data.quantity; // Net count or total moved
  await shop.save();

  // 3. Record Transaction (Main Event)
  const tx = await transactionService.recordTransaction(
    {
      category: 'shop_cylinder_exchange',
      amount: totalPrice,
      paymentMethod, // Main method (usually 'cash' or 'due')
      shopId,
      vehicleId,
      ref,
      details: {
        ...details,
        cylinders,
        paidAmount,
        dueAmount: due,
      },
    },
    userId,
    storeId
  );

  logger.info(`Cylinder Exchange: ${shop.shopName} - Total: ${totalPrice}`);

  return { tx, shop };
};

export default { clearShopDue, handleCylinderExchange };
