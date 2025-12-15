import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { localBrandService } from './index.js';

import { assertAuth, assertMembership, withTransaction } from '@/common/index.js';

/**
 * ----------------- General Local Brand Controllers -----------------
 */
export const getAllLocalBrands = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const mode =
    req.query.mode === 'active' || req.query.mode === 'detailed' || req.query.mode === 'all'
      ? (req.query.mode as 'active' | 'all' | 'detailed')
      : 'all';

  const { localBrands, total } = await localBrandService.getAllLocalBrands(
    storeId,
    page,
    limit,
    mode
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Local brands fetched successfully in mode: ${mode.toUpperCase()}`,
    meta: { page, limit, total },
    data: localBrands,
  });
};

export const selectLocalBrands = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const { brandUpdatedCount, cylinderUpdatedCount } = await localBrandService.selectLocalBrands(
    req.body,
    userId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Brand selection updated successfully.`,
    data: {
      brandUpdatedCount,
      cylinderUpdatedCount,
    },
  });
};

export const updateLocalBrand = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, brandId } = req.params;

  const brand = await withTransaction(async session => {
    return await localBrandService.updateLocalBrand(brandId, req.body, storeId, userId, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Local brand updated successfully',
    data: { brand },
  });
};

export default {
  getAllLocalBrands,
  selectLocalBrands,
  updateLocalBrand,
};
