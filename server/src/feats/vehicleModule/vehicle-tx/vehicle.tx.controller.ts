import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { vehicleTxService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

export const addFuel = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, vehicleId } = req.params;

  const transaction = await withTransaction(async session => {
    return await vehicleTxService.addFuel(req.body, userId, storeId, vehicleId, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Fuel expense added successfully',
    data: { transaction },
  });
};

export const addRepair = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, vehicleId } = req.params;

  const transaction = await withTransaction(async session => {
    return await vehicleTxService.addRepair(req.body, userId, storeId, vehicleId, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Repair expense added successfully',
    data: { transaction },
  });
};

export default { addFuel, addRepair };
