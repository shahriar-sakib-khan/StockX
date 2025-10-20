/**
 * @module vehicleTx.service
 *
 * @description Services for managing vehicle repair, fuel, and transaction operations.
 */

import { Types } from 'mongoose';
import { Errors } from '@/error/index.js';

import {
  Transaction,
  transactionService,
  transactionSanitizers,
} from '@/feats/transactionModule/index.js';

import { Vehicle } from '../index.js';
import { vehicleTxValidator, vehicleTxConstants } from './index.js';

/**
 * @function addRepair
 * @description Adds a repair transaction for a vehicle.
 *
 * @param {Object} repairData - The repair transaction data.
 * @param {string} userId - The ID of the user who is adding the repair transaction.
 * @param {string} storeId - The ID of the store where the vehicle is located.
 * @param {string} vehicleId - The ID of the vehicle to add the repair transaction for.
 */
export const addRepair = async (
  repairData: vehicleTxValidator.RepairTxInput,
  userId: string,
  storeId: string,
  vehicleId: string
) => {
  const { totalAmount, paymentMethod, ref, details } = repairData;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  // Update total repair cost
  vehicle.totalRepairCost += totalAmount;
  await vehicle.save();

  // Transaction-specific fields
  const txData = {
    category: vehicleTxConstants.VehicleTxCategory.VEHICLE_REPAIR_PAYMENT,
    totalAmount,
    paymentMethod,
    counterpartyType: vehicleTxConstants.VehicleCounterpartyKind.VEHICLE,
    vehicleId,
    ref,
    details,
  };

  const tx = await transactionService.recordTransaction(txData, userId, storeId);
  return tx;
};

/**
 * @function addFuel
 * @description Adds a fuel transaction for a vehicle.
 *
 *  @param {Object} fuelData - The fuel transaction data.
 * @param {string} userId - The ID of the user who is adding the fuel transaction.
 * @param {string} storeId - The ID of the store where the vehicle is located.
 * @param {string} vehicleId - The ID of the vehicle to add the fuel transaction for.
 */
export const addFuel = async (
  fuelData: vehicleTxValidator.FuelTxInput,
  userId: string,
  storeId: string,
  vehicleId: string
) => {
  const { totalAmount, paymentMethod, ref, details } = fuelData;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  // Update total fuel cost
  vehicle.totalFuelCost += totalAmount;
  await vehicle.save();

  // Transaction-specific fields
  const txData = {
    category: vehicleTxConstants.VehicleTxCategory.VEHICLE_FUEL_PAYMENT,
    totalAmount,
    paymentMethod,
    counterpartyType: vehicleTxConstants.VehicleCounterpartyKind.VEHICLE,
    vehicleId,
    ref,
    details,
  };

  const tx = await transactionService.recordTransaction(txData, userId, storeId);

  return tx;
};

/**
 * @function singleVehicleTransactions
 * @description Retrieves all transactions for a single vehicle with pagination
 *
 * @param {string} storeId - The ID of the store where the vehicle is located.
 * @param {string} vehicleId - The ID of the vehicle to retrieve transactions for.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 */
export const singleVehicleTransactions = async (
  storeId: string,
  vehicleId: string,
  page: number,
  limit: number
): Promise<transactionSanitizers.SanitizedTransactions & { total: number }> => {
  const total = await Transaction.countDocuments({
    vehicleId: new Types.ObjectId(vehicleId),
    store: new Types.ObjectId(storeId),
  });
  if (total === 0) return { transactions: [], total };

  const skip = (page - 1) * limit;
  const transactions = await Transaction.find({
    vehicleId: new Types.ObjectId(vehicleId),
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
 * @function allVehicleTransactions
 * @description Retrieves all transactions for all vehicles in a store with pagination
 */
export const allVehicleTransactions = async (
  storeId: string,
  page: number,
  limit: number
): Promise<transactionSanitizers.SanitizedTransactions & { total: number }> => {
  const total = await Transaction.countDocuments({
    store: new Types.ObjectId(storeId),
    counterpartyType: vehicleTxConstants.VehicleCounterpartyKind.VEHICLE,
  });
  if (total === 0) return { transactions: [], total };

  const skip = (page - 1) * limit;
  const transactions = await Transaction.find({
    store: new Types.ObjectId(storeId),
    counterpartyType: vehicleTxConstants.VehicleCounterpartyKind.VEHICLE,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('vehicleId', 'registration name')
    .lean();

  return {
    transactions: transactionSanitizers.allTransactionSanitizer(transactions, [
      'id',
      'totalAmount',
      'transactionType',
      'vehicleId',
      'details',
    ]).transactions,
    total,
  };
};

/**
 * ----------------- Default Exports (vehicleTxService) -----------------
 */
export default {
  addRepair, // Add a repair transaction
  addFuel, // Add a fuel transaction
  singleVehicleTransactions, // Get all transactions for a vehicle
  allVehicleTransactions, // Get all transactions for all vehicles in a store
};
