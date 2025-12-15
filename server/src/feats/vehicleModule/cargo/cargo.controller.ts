import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cargoService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

export const loadVehicle = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, vehicleId } = req.params;

  const result = await withTransaction(async session => {
    return await cargoService.loadVehicle(vehicleId, storeId, userId, req.body, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle loaded successfully',
    data: { vehicle: result },
  });
};

export const unloadVehicle = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, vehicleId } = req.params;

  const result = await withTransaction(async session => {
    return await cargoService.unloadVehicle(vehicleId, storeId, userId, req.body, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Vehicle unloaded successfully',
    data: { vehicle: result },
  });
};

export default { loadVehicle, unloadVehicle };
