/**
 * @module CylinderTxController
 *
 * @description Controller for cylinder transaction operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { cylinderTxService } from './index.js';
import { assertAuth } from '@/common/assertions.js';

/**
 * ----------------- Handle Cylinder Transaction (Buy / Sell) -----------------
 *
 * @swagger
 * /stores/{storeId}/cylinders/transactions:
 *   post:
 *     summary: Handle buying or selling cylinders
 *     description: Handles both buying and selling operations based on mode ('buy' or 'sell').
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: mode
 *         required: true
 *         schema:
 *           type: string
 *           enum: [buy, sell]
 */
export const handleCylinderTransaction = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const size = Number(req.query.size) || 12;
  const regulatorType = Number(req.query.regulatorType) || 22;

  let mode = String(req.query.mode) as 'buy' | 'sell' | undefined;
  if (mode !== 'buy' && mode !== 'sell') {
    mode = 'sell';
    console.warn(`[WARN] Invalid mode provided, defaulting to 'sell'`);
  }

  const result = await cylinderTxService.handleCylinderTransaction(
    req.body,
    size,
    regulatorType,
    mode,
    userId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Cylinder transaction (${mode}) recorded successfully.`,
    data: result,
  });
};

/**
 * ----------------- Mark or Unmark Defected Cylinders -----------------
 *
 * @swagger
 * /stores/{storeId}/cylinders/mark-defected:
 *   post:
 *     summary: Mark or unmark cylinders as defected
 */
export const handleDefectedMarking = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const size = Number(req.query.size) || 12;
  const regulatorType = Number(req.query.regulatorType) || 22;

  let doMark = true;
  if (String(req.query.doMark) === 'false') {
    doMark = false;
  } else if (String(req.query.doMark) !== 'true') {
    console.warn(`[WARN] Invalid mode provided, defaulting to 'true'`);
  }

  const result = await cylinderTxService.handleDefectedCylinderMarking(
    req.body,
    size,
    regulatorType,
    doMark,
    userId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Cylinder defect status updated successfully.`,
    data: result,
  });
};

/**
 * ----------------- Exchange Full-for-Empty Cylinders -----------------
 *
 * @swagger
 * /stores/{storeId}/cylinders/exchange/full-empty:
 *   post:
 *     summary: Exchange full cylinders for empty ones
 */
export const exchangeFullForEmpty = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;
  const { fullOut, emptyIn, paymentMethod } = req.body;

  const result = await cylinderTxService.exchangeFullForEmpty(
    fullOut,
    emptyIn,
    paymentMethod,
    userId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Full-for-empty cylinder exchange completed successfully.',
    data: result,
  });
};

/**
 * ----------------- Exchange Empty-for-Empty Cylinders -----------------
 *
 * @swagger
 * /stores/{storeId}/cylinders/exchange/empty-empty:
 *   post:
 *     summary: Exchange empty cylinders between stores
 */
export const exchangeEmptyForEmpty = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;
  const { cylinderOut, cylinderIn, giverStoreId } = req.body;

  const result = await cylinderTxService.exchangeEmptyForEmpty(
    cylinderOut,
    cylinderIn,
    giverStoreId,
    storeId,
    userId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Empty-for-empty exchange recorded successfully.',
    data: result,
  });
};

/**
 * ----------------- Get All Cylinder Transactions -----------------
 *
 * @swagger
 * /stores/{storeId}/cylinders/transactions/all:
 *   get:
 *     summary: Retrieve all cylinder transactions with pagination
 */
export const allCylinderTransactions = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const result = await cylinderTxService.allCylinderTransactions(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Cylinder transactions fetched successfully.',
    meta: { page, limit },
    data: result.transactions,
  });
};

/**
 * ----------------- Default Exports (CylinderTxController) -----------------
 */
export default {
  handleCylinderTransaction,
  handleDefectedMarking,

  exchangeFullForEmpty,
  exchangeEmptyForEmpty,

  allCylinderTransactions,
};
