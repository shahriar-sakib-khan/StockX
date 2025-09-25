/**
 * @module VehicleTxController
 *
 * @description Controller for managing vehicle repair, fuel, and transaction operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { vehicleTxService } from './index.js';

/**
 * ----------------- Vehicle Transaction Controllers -----------------
 */

/**
 * @function addRepair
 * @description Adds a repair record for a specific vehicle
 */
export const addRepair = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId, vehicleId } = req.params;

  const repair = await vehicleTxService.addRepair(req.body, userId, storeId, vehicleId);

  res.status(StatusCodes.CREATED).json({
    message: 'Repair record added successfully',
    repair,
  });
};

/**
 * @function addFuel
 * @description Adds a fuel expense for a specific vehicle
 */
export const addFuel = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId, vehicleId } = req.params;

  const fuel = await vehicleTxService.addFuel(req.body, userId, storeId, vehicleId);

  res.status(StatusCodes.CREATED).json({
    message: 'Fuel expense added successfully',
    fuel,
  });
};

/**
 * @function singleVehicleTransactions
 * @description Retrieves all transactions for a specific vehicle with pagination
 */
export const singleVehicleTransactions = async (req: Request, res: Response) => {
  const { storeId, vehicleId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { transactions, total } = await vehicleTxService.singleVehicleTransactions(
    storeId,
    vehicleId,
    page,
    limit
  );

  res.status(StatusCodes.OK).json({
    total,
    page,
    limit,
    transactions,
  });
};

/**
 * @function allVehicleTransactions
 * @description Retrieves all transactions for all vehicles in a store with pagination
 */
export const allVehicleTransactions = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { transactions, total } = await vehicleTxService.allVehicleTransactions(
    storeId,
    page,
    limit
  );

  res.status(StatusCodes.OK).json({
    total,
    page,
    limit,
    transactions,
  });
};

/**
 * ----------------- Default Exports (vehicleTxController) -----------------
 */
export default {
  addRepair,
  addFuel,
  singleVehicleTransactions,
  allVehicleTransactions,
};
