import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { shopTxService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

export const clearShopDue = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, shopId } = req.params;

  const transaction = await withTransaction(async session => {
    return await shopTxService.clearShopDue(req.body, userId, storeId, shopId, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Shop due cleared successfully',
    data: { transaction },
  });
};

export const cylinderExchange = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const result = await withTransaction(async session => {
    return await shopTxService.handleCylinderExchange(req.body, userId, storeId, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Exchange recorded successfully',
    data: result,
  });
};

export default { clearShopDue, cylinderExchange };
