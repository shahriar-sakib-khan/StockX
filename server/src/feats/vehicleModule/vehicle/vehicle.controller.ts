/**
 * @module VehicleController
 *
 * @description Controller for handling vehicle CRUD operations within a store.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';
import { vehicleService } from './index.js';

/**
 * ----------------- Vehicle Controllers -----------------
 */

/**
 * @function createVehicle
 * @description Create a new vehicle for a store
 */
export const createVehicle = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const vehicle = await vehicleService.createVehicle(req.body, userId, storeId);

  res.status(StatusCodes.CREATED).json({
    message: 'Vehicle created successfully',
    vehicle,
  });
};

/**
 * @function getAllVehicles
 * @description Get all vehicles for a given store
 */
export const getAllVehicles = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { vehicles, total } = await vehicleService.getAllVehicles(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    total,
    page,
    limit,
    vehicles,
  });
};

/**
 * @function getSingleVehicle
 * @description Get a single vehicle by its ID
 */
export const getSingleVehicle = async (req: Request, res: Response) => {
  const { storeId, vehicleId } = req.params;

  const vehicle = await vehicleService.getVehicleById(storeId, vehicleId);

  res.status(StatusCodes.OK).json({ vehicle });
};

/**
 * @function updateVehicle
 * @description Update details of a vehicle
 */
export const updateVehicle = async (req: Request, res: Response) => {
  const { storeId, vehicleId } = req.params;

  const updatedVehicle = await vehicleService.updateVehicle(req.body, storeId, vehicleId);

  res.status(StatusCodes.OK).json({
    message: 'Vehicle updated successfully',
    updatedVehicle,
  });
};

/**
 * @function deleteVehicle
 * @description Delete a vehicle from the store
 */
export const deleteVehicle = async (req: Request, res: Response) => {
  const { storeId, vehicleId } = req.params;

  const deletedVehicle = await vehicleService.deleteVehicle(storeId, vehicleId);

  res.status(StatusCodes.OK).json({
    message: 'Vehicle deleted successfully',
    deletedVehicle,
  });
};

/**
 * ----------------- Default Exports (vehicleController) -----------------
 */
export default {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
