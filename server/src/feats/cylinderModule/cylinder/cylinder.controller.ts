/**
 * @module CylinderController
 *
 * @description Controller for cylinder related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cylinderService } from './index.js';

/**
 * ----------------- Cylinder Inventory Controllers -----------------
 */
export const getCylinderInventory = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const size = Number(req.query.size) || 0;
  const regulatorType = String(req.query.regulatorType) || '';

  const inventoryData = await cylinderService.getCylinderInventory(storeId, size, regulatorType);

  res.status(StatusCodes.OK).json(inventoryData);
};

/**
* ----------------- General Cylinder Controllers -----------------
*/
export const getAllActiveCylinders = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { cylinders, total } = await cylinderService.getAllActiveCylinders(storeId, page, limit);

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

/**
* ----------------- Default exports : cylinderController -----------------
*/
export default {
  getCylinderInventory,

  getAllActiveCylinders,
  allCylinders,
  detailedCylinders,
};
