import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { regulatorService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

export const getRegulators = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId } = req.params;
  const { page, limit, mode, regulatorType } = req.query as any;

  const result = await regulatorService.getRegulators(
    storeId,
    Number(page),
    Number(limit),
    mode,
    regulatorType ? Number(regulatorType) : undefined
  );

  res.status(StatusCodes.OK).json({
    success: true,
    data: result.regulators,
    meta: { total: result.total, page: Number(page), limit: Number(limit) },
  });
};

export const updatePrice = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, regulatorId } = req.params;
  const { price } = req.body;

  const regulator = await withTransaction(async session => {
    return await regulatorService.updatePrice(regulatorId, price, storeId, userId, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Price updated successfully',
    data: { regulator },
  });
};

export default { getRegulators, updatePrice };
