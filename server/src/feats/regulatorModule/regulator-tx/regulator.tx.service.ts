import { Errors } from '@/error/index.js';

import { Regulator, regulatorSanitizers } from '../index.js';
import { regulatorTxConstants } from './index.js';

import { transactionService } from '@/feats/transactionModule/index.js';

/**
 * @function handleRegulatorTransaction
 * @description Handles buying and selling of regulators.
 * 'buy' → Adds to stockCount
 * 'sell' → Subtracts from stockCount
 *
 * @param {Object} txData - Transaction payload (price, quantity, totalAmount, paymentMethod, id).
 * @param {number} regulatorType - Regulator type.
 * @param {'buy' | 'sell'} mode - Transaction mode.
 * @param {string} transactorId - ID of user performing the transaction.
 * @param {string} storeId - ID of the store.
 */
export const handleRegulatorTransaction = async (
  txData: any,
  regulatorType: number,
  mode: 'buy' | 'sell',
  transactorId: string,
  storeId: string
) => {
  const { id, price, quantity, totalAmount, paymentMethod } = txData;

  const regulator = await Regulator.findById(id);
  if (!regulator) throw new Errors.NotFoundError('Regulator not found');
  if (regulator.regulatorType !== regulatorType)
    throw new Errors.BadRequestError('Invalid regulator type for transaction');

  // Update inventory
  regulator.updatedAt = new Date();
  if (mode === 'buy') {
    regulator.stockCount += quantity;
  } else if (mode === 'sell') {
    if (regulator.stockCount < quantity)
      throw new Errors.BadRequestError('Insufficient stock for sale');
    regulator.stockCount -= quantity;
  }

  await regulator.save();

  // Record transaction
  const txRecord = {
    category:
      mode === 'buy'
        ? regulatorTxConstants.RegulatorTxCategory.REGULATOR_PURCHASE_WHOLESALE_CASH
        : regulatorTxConstants.RegulatorTxCategory.REGULATOR_SALE_CASH,
    price,
    quantity,
    totalAmount,
    paymentMethod,
    counterpartyType:
      mode === 'buy'
        ? regulatorTxConstants.RegulatorCounterpartyKind.SUPPLIER
        : regulatorTxConstants.RegulatorCounterpartyKind.CUSTOMER,
    regulatorId: regulator._id,
    ref: `${mode === 'buy' ? 'Purchase' : 'Sale'}_${Date.now()}`,
    details: {
      name: regulator.name,
      regulatorType,
      pricePerUnit: price,
      quantity,
      totalAmount,
    },
  };

  const tx = await transactionService.recordTransaction(txRecord, transactorId, storeId);

  return { regulator: regulatorSanitizers.regulatorSanitizer(regulator), tx };
};

/**
 * @function handleDefectedRegulatorMarking
 * @description Marks or unmarks regulators as defected.
 *
 * @param {Object} defectData - { id, quantity }
 * @param {number} regulatorType - Regulator type.
 * @param {boolean} doMark - true → mark as defected, false → unmark.
 * @param {string} transactorId - User ID.
 * @param {string} storeId - Store ID.
 */
export const handleDefectedRegulatorMarking = async (
  defectData: any,
  regulatorType: number,
  doMark: boolean,
  transactorId: string,
  storeId: string
) => {
  const { id, quantity } = defectData;

  const regulator = await Regulator.findById(id);
  if (!regulator) throw new Errors.NotFoundError('Regulator not found');
  if (regulator.regulatorType !== regulatorType)
    throw new Errors.BadRequestError('Invalid regulator type');

  if (doMark) {
    if (regulator.stockCount < quantity)
      throw new Errors.BadRequestError('Not enough regulators to mark as defected');
    regulator.stockCount -= quantity;
    regulator.defectedCount += quantity;
  } else {
    if (regulator.defectedCount < quantity)
      throw new Errors.BadRequestError('Not enough defected regulators to unmark');
    regulator.defectedCount -= quantity;
    regulator.stockCount += quantity;
  }

  regulator.updatedAt = new Date();
  await regulator.save();

  const txRecord = {
    category: regulatorTxConstants.RegulatorTxCategory.REGULATOR_SWAP_DEFECTED,
    quantity,
    totalAmount: 0,
    paymentMethod: regulatorTxConstants.RegulatorPaymentMethod.NON_CASH,
    counterpartyType: regulatorTxConstants.RegulatorCounterpartyKind.INTERNAL,
    regulatorId: regulator._id,
    ref: `${Date.now()}`,
    details: {
      regulatorType,
      quantity,
    },
  };

  const tx = await transactionService.recordTransaction(txRecord, transactorId, storeId);

  return { regulator: regulatorSanitizers.regulatorSanitizer(regulator), tx };
};

export default {
  handleRegulatorTransaction,
  handleDefectedRegulatorMarking,
};
