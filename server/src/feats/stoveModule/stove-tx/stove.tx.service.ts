import { Errors } from '@/error/index.js';

import { Stove, stoveSanitizers } from '../index.js';
import { stoveTxConstants } from './index.js';

import { transactionService } from '@/feats/transactionModule/index.js';

/**
 * @function handleStoveTransaction
 * @description Handles buying and selling of stoves.
 * 'buy' → Adds to stockCount
 * 'sell' → Subtracts from stockCount
 *
 * @param {Object} txData - Transaction payload (price, quantity, totalAmount, paymentMethod, id).
 * @param {number} burnerCount - Stove burner count.
 * @param {'buy' | 'sell'} mode - Transaction mode.
 * @param {string} transactorId - ID of user performing the transaction.
 * @param {string} storeId - ID of the store.
 */
export const handleStoveTransaction = async (
  txData: any,
  burnerCount: number,
  mode: 'buy' | 'sell',
  transactorId: string,
  storeId: string
) => {
  const { id, price, quantity, totalAmount, paymentMethod } = txData;

  const stove = await Stove.findById(id);
  if (!stove) throw new Errors.NotFoundError('Stove not found');
  if (stove.burnerCount !== burnerCount)
    throw new Errors.BadRequestError('Invalid burner count for transaction');

  // Update inventory
  stove.updatedAt = new Date();
  if (mode === 'buy') {
    stove.stockCount += quantity;
  } else if (mode === 'sell') {
    if (stove.stockCount < quantity)
      throw new Errors.BadRequestError('Insufficient stock for sale');
    stove.stockCount -= quantity;
  }

  await stove.save();

  // Record transaction
  const txRecord = {
    category:
      mode === 'buy'
        ? stoveTxConstants.StoveTxCategory.STOVE_PURCHASE_WHOLESALE_CASH
        : stoveTxConstants.StoveTxCategory.STOVE_SALE_CASH,
    price,
    quantity,
    totalAmount,
    paymentMethod,
    counterpartyType:
      mode === 'buy'
        ? stoveTxConstants.StoveCounterpartyKind.SUPPLIER
        : stoveTxConstants.StoveCounterpartyKind.CUSTOMER,
    stoveId: stove._id,
    ref: `${mode === 'buy' ? 'Purchase' : 'Sale'}_${Date.now()}`,
    details: {
      name: stove.name,
      burnerCount,
      pricePerUnit: price,
      quantity,
      totalAmount,
    },
  };

  const tx = await transactionService.recordTransaction(txRecord, transactorId, storeId);

  return { stove: stoveSanitizers.stoveSanitizer(stove), tx };
};

/**
 * @function handleDefectedStoveMarking
 * @description Marks or unmarks stoves as defected.
 *
 * @param {Object} defectData - { id, quantity }
 * @param {number} burnerCount - Stove burner count.
 * @param {boolean} doMark - true → mark as defected, false → unmark.
 * @param {string} transactorId - User ID.
 * @param {string} storeId - Store ID.
 */
export const handleDefectedStoveMarking = async (
  defectData: any,
  burnerCount: number,
  doMark: boolean,
  transactorId: string,
  storeId: string
) => {
  const { id, count: quantity } = defectData;

  const stove = await Stove.findById(id);
  if (!stove) throw new Errors.NotFoundError('Stove not found');
  if (stove.burnerCount !== burnerCount) throw new Errors.BadRequestError('Invalid burner count');

  if (doMark) {
    if (stove.stockCount - stove.defectedCount < quantity)
      throw new Errors.BadRequestError('Not enough stoves to mark as defected');
    stove.defectedCount += quantity;
  } else {
    if (stove.defectedCount < quantity)
      throw new Errors.BadRequestError('Not enough defected stoves to unmark');
    stove.defectedCount -= quantity;
  }

  stove.updatedAt = new Date();
  await stove.save();

  const txRecord = {
    category: stoveTxConstants.StoveTxCategory.STOVE_SWAP_DEFECTED,
    quantity,
    totalAmount: 0,
    paymentMethod: stoveTxConstants.StovePaymentMethod.NON_CASH,
    counterpartyType: stoveTxConstants.StoveCounterpartyKind.INTERNAL,
    stoveId: stove._id,
    ref: `${Date.now()}`,
    details: {
      burnerCount,
      quantity,
    },
  };

  const tx = await transactionService.recordTransaction(txRecord, transactorId, storeId);

  return { stove: stoveSanitizers.stoveSanitizer(stove), tx };
};

export default {
  handleStoveTransaction,
  handleDefectedStoveMarking,
};
