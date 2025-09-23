/**
 * @module CylinderController
 *
 * @description Controller for cylinder related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { cylinderTxService } from './index.js';

/**
 * ----------------- Cylinder Transaction Controllers -----------------
 */

export const buyCylinder = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId, cylinderId } = req.params;

  const transaction = await cylinderTxService.buyCylinder(req.body, userId, storeId, cylinderId);

  res.status(StatusCodes.CREATED).json({ message: 'Cylinder purchased successfully', transaction });
};

export const sellCylinder = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId, cylinderId } = req.params;

  const transaction = await cylinderTxService.sellCylinder(req.body, userId, storeId, cylinderId);

  res.status(StatusCodes.CREATED).json({ message: 'Cylinder sold successfully', transaction });
};

export const allCylinderTransactions = async (req: Request, res: Response) => {
  assertAuth(req);
  const { cylinderId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { transactions, total } = await cylinderTxService.allCylinderTransactions(
    cylinderId,
    page,
    limit
  );

  res.status(StatusCodes.OK).json({ total, page, limit, transactions });
};

/**
 * ----------------- Default Exports (cylinderController) -----------------
 */
export default {
  buyCylinder,
  sellCylinder,
  allCylinderTransactions,
};
