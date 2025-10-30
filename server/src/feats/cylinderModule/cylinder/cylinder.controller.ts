/**
 * @module CylinderController
 *
 * @description Controller for cylinder related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cylinderService } from './index.js';
import { assertAuth } from '@/common/assertions.js';

/**
 * ----------------- Cylinder Inventory Controllers -----------------
 */
export const getCylinderInventory = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  // Defaulting to standard domestic 12kg and 22mm regulator
  const size = Number(req.query.size) || 12;
  const regulatorType = Number(req.query.regulatorType) || 22;

  const { cylinders } = await cylinderService.getCylinderInventory(storeId, size, regulatorType);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Cylinder inventory fetched successfully ${cylinders.length === 0 ? ': No Active cylinders' : ''}`,
    data: cylinders,
  });
};

/**
 * ----------------- General Cylinder Controllers -----------------
 *
 * Uses unified service: getAllCylinders()
 *
 * Modes:
 * - 'active'   → Only active cylinders.
 * - 'all'      → All cylinders (active + inactive).
 * - 'detailed' → All cylinders with full detailed data.
 *
 * @swagger
 * parameters:
 *   - in: query
 *     name: mode
 *     schema:
 *       type: string
 *       enum: [active, all, detailed]
 *     description: Filter mode for cylinders
 */
export const getAllCylinders = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const mode =
    req.query.mode === 'active' || req.query.mode === 'detailed' || req.query.mode === 'all'
      ? (req.query.mode as 'active' | 'all' | 'detailed')
      : 'all'; // fallback to 'all' if invalid mode is given

  const { cylinders, total } = await cylinderService.getAllCylinders(storeId, page, limit, mode);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Cylinders fetched successfully in mode : ${mode.toUpperCase()}`,
    meta: { page, limit, total },
    data: cylinders,
  });
};

/**
 * ----------------- Cylinder Inventory Controllers -----------------
 */
export const updateCylinderPrice = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  // Extract and sanitize inputs
  const size = Number(req.query.size);
  const regulatorType = Number(req.query.regulatorType);

  const cylinder = await cylinderService.updateCylinderPrice(
    req.body,
    size,
    regulatorType,
    storeId,
    userId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Cylinder price updated successfully.`,
    data: { cylinder },
  });
};

/**
 * ----------------- Default exports : cylinderController -----------------
 */
export default {
  getCylinderInventory,
  getAllCylinders,
  updateCylinderPrice,
};
