/**
 * @module LoadController
 *
 * @description Controller for cylinder load (into vehicle) operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { loadService } from './index.js';

/**
 * ----------------- Load Cylinder -----------------
 */
export const loadCylinder = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  let mode = String(req.query.mode) as 'full' | 'empty' | undefined;
  if (mode !== 'full' && mode !== 'empty') {
    mode = 'full';
    console.warn(`[WARN] Invalid mode provided, defaulting to 'full'`);
  }

  const ex = await loadService.loadCylinder(req.body, mode, userId);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Cylinder load recorded successfully.',
    data: ex,
  });
};

/**
 * ----------------- Unload Cylinder -----------------
 */
export const unloadCylinder = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  let mode = String(req.query.mode) as 'full' | 'empty' | undefined;
  if (mode !== 'full' && mode !== 'empty') {
    mode = 'full';
    console.warn(`[WARN] Invalid mode provided, defaulting to 'full'`);
  }

  const ex = await loadService.unloadCylinder(req.body, mode, userId);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Cylinder unload recorded successfully.',
    data: ex,
  });
};

/**
 * ----------------- Default Export -----------------
 */
export default {
  loadCylinder,
  unloadCylinder,
};
