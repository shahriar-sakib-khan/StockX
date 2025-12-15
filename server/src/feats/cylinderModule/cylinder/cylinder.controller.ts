import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cylinderService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

export const getInventory = async (req: Request, res: Response) => {
  assertMembership(req);
  // Validated by Zod, safe to cast or access
  const { mode, size, regulatorType } = req.query as any;

  const result = await cylinderService.getCylindersByMode(
    req.params.storeId,
    mode,
    Number(size),
    Number(regulatorType)
  );

  res.status(StatusCodes.OK).json({
    success: true,
    data: result,
  });
};

export const bulkUpdatePrices = async (req: Request, res: Response) => {
  assertMembership(req);

  const result = await withTransaction(session =>
    cylinderService.bulkUpdatePrices(req.params.storeId, req.body.updates, session)
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Prices updated successfully',
    data: result,
  });
};

export const selectLocalBrands = async (req: Request, res: Response) => {
  assertMembership(req);

  const result = await withTransaction(session =>
    cylinderService.selectLocalBrands(req.params.storeId, req.body.selections, session)
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Brand selections updated successfully',
    data: result,
  });
};

export default {
  getInventory,
  bulkUpdatePrices,
  selectLocalBrands,
};
