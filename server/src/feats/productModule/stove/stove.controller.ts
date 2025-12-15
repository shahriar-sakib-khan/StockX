import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { stoveService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

export const getStoves = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId } = req.params;
  const { page, limit, mode, burnerCount } = req.query as any;

  const result = await stoveService.getStoves(
    storeId,
    Number(page),
    Number(limit),
    mode,
    burnerCount ? Number(burnerCount) : undefined
  );

  res.status(StatusCodes.OK).json({
    success: true,
    data: result.stoves,
    meta: { total: result.total, page: Number(page), limit: Number(limit) },
  });
};

export const updatePrice = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, stoveId } = req.params;
  const { price } = req.body;

  const stove = await withTransaction(async session => {
    return await stoveService.updatePrice(stoveId, price, storeId, userId, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Price updated successfully',
    data: { stove },
  });
};

export default { getStoves, updatePrice };
