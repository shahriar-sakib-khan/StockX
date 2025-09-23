/**
 * @module CylinderController
 *
 * @description Controller for cylinder related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cylinderService } from './index.js';

/**
 * ----------------- Inventory Controllers -----------------
 */

export const getActiveCylinders = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { cylinders, total } = await cylinderService.getActiveCylinders(storeId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, cylinders });
};

export const allCylinders = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { cylinders, total } = await cylinderService.getAllCylinders(storeId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, cylinders });
};

export const detailedCylinders = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { cylinders, total } = await cylinderService.detailedCylinders(storeId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, cylinders });
};

export default {
  getActiveCylinders,
  allCylinders,
  detailedCylinders,
};
