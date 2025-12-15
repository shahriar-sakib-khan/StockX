import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { vehicleService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

/**
 * ----------------- Write Operations -----------------
 */
export const createVehicle = async (req: Request, res: Response) => {
  assertMembership(req); // Security Fix
  const { userId } = req.user;
  const { storeId } = req.params;

  const vehicle = await withTransaction(async session => {
    return await vehicleService.createVehicle(req.body, userId, storeId, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Vehicle created successfully',
    data: { vehicle },
  });
};

export const updateVehicle = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId, vehicleId } = req.params;

  const vehicle = await withTransaction(async session => {
    return await vehicleService.updateVehicle(vehicleId, storeId, req.body, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle updated successfully',
    data: { vehicle },
  });
};

export const deleteVehicle = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId, vehicleId } = req.params;

  const vehicle = await withTransaction(async session => {
    return await vehicleService.deleteVehicle(vehicleId, storeId, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle deleted successfully',
    data: { vehicle },
  });
};

/**
 * ----------------- Read Operations -----------------
 */
export const getAllVehicles = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { vehicles, total } = await vehicleService.getAllVehicles(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicles fetched successfully',
    meta: { page, limit, total },
    data: { vehicles },
  });
};

export const getSingleVehicle = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId, vehicleId } = req.params;

  const vehicle = await vehicleService.getVehicleById(vehicleId, storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle fetched successfully',
    data: { vehicle },
  });
};

export default {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
  getSingleVehicle,
};
