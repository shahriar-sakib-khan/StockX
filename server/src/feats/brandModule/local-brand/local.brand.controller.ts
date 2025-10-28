/**
 * @module LocalBrandController
 *
 * @description Controller for managing Local Brands and their relationships with Cylinders.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { localBrandService } from './index.js';
import { assertAuth } from '@/common/assertions.js';

/**
 * ----------------- General Local Brand Controllers -----------------
 *
 * Uses unified service: getAllLocalBrands()
 *
 * Modes:
 * - 'active'   → Only active brands
 * - 'all'      → All brands (active + inactive)
 * - 'detailed' → All brands with full detailed data
 *
 * @swagger
 * parameters:
 *   - in: query
 *     name: mode
 *     schema:
 *       type: string
 *       enum: [active, all, detailed]
 *     description: Filter mode for brands
 */
export const getAllLocalBrands = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const mode =
    req.query.mode === 'active' || req.query.mode === 'detailed' || req.query.mode === 'all'
      ? (req.query.mode as 'active' | 'all' | 'detailed')
      : 'all'; // fallback to 'all' if invalid mode is given

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

/**
 * ----------------- Local Brand Selection Controller -----------------
 *
 * @description
 * Updates the active status of local brands and synchronizes their related cylinders.
 *
 * @route PATCH /stores/:storeId/local-brands/select
 * @body  [{ id: string, isActive: boolean }]
 */
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

/**
 * ----------------- Default Exports : localBrandController -----------------
 */
export default {
  getAllLocalBrands,
  selectLocalBrands,
};
