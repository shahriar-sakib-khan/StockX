/**
 * @module LocalBrandController
 *
 * @description Controller for managing local brand operations within a store.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { localBrandService } from './index.js';

/**
 * ----------------- Local Brand Controllers -----------------
 */

export const allLocalBrands = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { localBrands, total } = await localBrandService.getAllLocalBrands(page, limit, storeId);

  res.status(StatusCodes.OK).json({ total, page, limit, localBrands });
};

/**
 * @function activeLocalBrands
 * @description Retrieves all active local brands for a given store with pagination.
 */
export const activeLocalBrands = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { localBrands, total } = await localBrandService.getActiveLocalBrands(page, limit, storeId);

  res.status(StatusCodes.OK).json({ total, page, limit, localBrands });
};

export const detailedLocalBrands = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { localBrands, total } = await localBrandService.detailedLocalBrands(page, limit, storeId);

  res.status(StatusCodes.OK).json({ total, page, limit, localBrands });
};

export const selectBrands = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const updateStats = await localBrandService.selectLocalBrands(req.body, userId);

  res.status(StatusCodes.OK).json({ message: 'Brands selected successfully', updateStats });
};

/**
 * ----------------- Default Exports (localBrandController) -----------------
 */
export default {
  allLocalBrands,
  activeLocalBrands,
  detailedLocalBrands,
  selectBrands,
};
