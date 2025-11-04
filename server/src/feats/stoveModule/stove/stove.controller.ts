/**
 * @module StoveController
 *
 * @description Controller for stove-related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { stoveService } from './index.js';
import { assertAuth } from '@/common/assertions.js';

/**
 * ----------------- Stove Inventory Controllers -----------------
 */
export const getStoveInventory = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const { stoves } = await stoveService.getStoveInventory(storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Stove inventory fetched successfully ${
      stoves.length === 0 ? ': No active stoves' : ''
    }`,
    data: stoves,
  });
};

/**
 * ----------------- General Stove Controllers -----------------
 *
 * Modes:
 * - 'active'   → Stoves with stockCount > 0
 * - 'all'      → All stoves
 * - 'detailed' → All stoves with full detailed data
 */
export const getAllStoves = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const mode =
    req.query.mode === 'active' || req.query.mode === 'detailed' || req.query.mode === 'all'
      ? (req.query.mode as 'active' | 'all' | 'detailed')
      : 'all';

  const { stoves, total } = await stoveService.getAllStoves(storeId, page, limit, mode);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Stoves fetched successfully in mode: ${mode.toUpperCase()}`,
    meta: { page, limit, total },
    data: stoves,
  });
};

/**
 * ----------------- Stove Update Controller -----------------
 */
export const updateStovePrice = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;
  const { id, price } = req.body;

  if (!id || !price) throw new Error('Stove ID and price are required.');

  const stove = await stoveService.updateStovePrice(id, price, storeId, userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Stove price updated successfully.`,
    data: { stove },
  });
};

/**
 * ----------------- Default Exports (stoveController) -----------------
 */
export default {
  getStoveInventory,
  getAllStoves,
  updateStovePrice,
};
