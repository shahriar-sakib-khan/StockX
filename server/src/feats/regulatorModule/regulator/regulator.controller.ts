/**
 * @module RegulatorController
 *
 * @description Controller for regulator-related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { regulatorService } from './index.js';
import { assertAuth } from '@/common/assertions.js';

/**
 * ----------------- Regulator Inventory Controllers -----------------
 */
export const getRegulatorInventory = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const { regulators } = await regulatorService.getRegulatorInventory(storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Regulator inventory fetched successfully ${
      regulators.length === 0 ? ': No active regulators' : ''
    }`,
    data: regulators,
  });
};

/**
 * ----------------- General Regulator Controllers -----------------
 *
 * Modes:
 * - 'active'   → Regulators with stockCount > 0
 * - 'all'      → All regulators
 * - 'detailed' → All regulators with full detailed data
 */
export const getAllRegulators = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const mode =
    req.query.mode === 'active' || req.query.mode === 'detailed' || req.query.mode === 'all'
      ? (req.query.mode as 'active' | 'all' | 'detailed')
      : 'all';

  const { regulators, total } = await regulatorService.getAllRegulators(storeId, page, limit, mode);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Regulators fetched successfully in mode: ${mode.toUpperCase()}`,
    meta: { page, limit, total },
    data: regulators,
  });
};

/**
 * ----------------- Regulator Update Controller -----------------
 */
export const updateRegulatorPrice = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;
  const { id, price } = req.body;

  if (!id || !price) throw new Error('Regulator ID and price are required.');

  const regulator = await regulatorService.updateRegulatorPrice(id, price, storeId, userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Regulator price updated successfully.`,
    data: { regulator },
  });
};

/**
 * ----------------- Default Exports (regulatorController) -----------------
 */
export default {
  getRegulatorInventory,
  getAllRegulators,
  updateRegulatorPrice,
};
