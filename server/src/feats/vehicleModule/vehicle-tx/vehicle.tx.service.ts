import { ClientSession } from 'mongoose';

import { Vehicle } from '../index.js';

import { vehicleTxValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { transactionService } from '@/feats/transactionModule/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function recordVehicleExpense
 * @description Record a vehicle expense (fuel or repair) by updating vehicle stats and creating a transaction.
 */
const recordVehicleExpense = async (
  category: 'fuel_payment' | 'repair_payment',
  vehicleId: string,
  storeId: string,
  userId: string,
  data: vehicleTxValidator.VehicleTxInput,
  session?: ClientSession
) => {
  const { amount, paymentMethod, ref, details } = data;

  // 1. Update Vehicle Stats (Atomic)
  const updateField = category === 'fuel_payment' ? 'totalFuelCost' : 'totalRepairCost';

  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, store: storeId },
    { $inc: { [updateField]: amount } },
    { new: true, session }
  );

  if (!vehicle) throw new Errors.NotFoundError('Vehicle not found');

  // 2. Create Transaction
  const tx = await transactionService.recordTransaction(
    {
      category,
      amount,
      paymentMethod,
      vehicleId,
      ref,
      details,
    },
    userId,
    storeId,
    session
  );

  logger.info(
    `Vehicle expense recorded: ${category} - ${amount} for vehicle ${vehicle.regNumber} (${vehicleId})`
  );

  return tx;
};

/**
 * @function addFuel
 * @description Add a fuel expense for a vehicle.
 */
export const addFuel = async (
  data: vehicleTxValidator.VehicleTxInput,
  userId: string,
  storeId: string,
  vehicleId: string,
  session?: ClientSession
) => {
  return recordVehicleExpense('fuel_payment', vehicleId, storeId, userId, data, session);
};

/**
 * @function addRepair
 * @description Add a repair expense for a vehicle.
 */
export const addRepair = async (
  data: vehicleTxValidator.VehicleTxInput,
  userId: string,
  storeId: string,
  vehicleId: string,
  session?: ClientSession
) => {
  return recordVehicleExpense('repair_payment', vehicleId, storeId, userId, data, session);
};

export default { addFuel, addRepair };
