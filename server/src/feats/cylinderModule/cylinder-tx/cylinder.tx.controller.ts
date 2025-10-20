/**
 * @module cylinderTx.controller
 *
 * @description Controllers for managing cylinder transactions:
 * purchase, sell, defect, and both exchange types.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as cylinderTxService from './cylinder.tx.service.js';
import { assertAuth } from '@/common/assertions.js';

/** ----------------- Cylinder buy and sell controllers ----------------- */

/**
 * @function buyCylinders
 * @description Handles cylinder purchase transactions
 */
export const buyCylinders = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId: transactorId } = req.user;
  const { storeId } = req.params;
  const { size, regulatorType } = req.query;
  const userData = req.body;
  const buyData = {
    ...userData,
    size: Number(size),
    regulatorType: String(regulatorType).trim() || '',
  };

  const tx = await cylinderTxService.buyCylinders(buyData, transactorId, storeId);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Cylinders bought successfully',
    data: tx,
  });
};

/**
 * @function sellCylinder
 * @description Handles selling (outgoing) full cylinders to customers
 */
export const sellCylinder = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId: transactorId } = req.user;
  const { storeId } = req.params;
  const { size, regulatorType } = req.query;
  const userData = req.body;
  const sellData = {
    ...userData,
    size: Number(size) || 0,
    regulatorType: String(regulatorType).trim() || '',
  };

  const tx = await cylinderTxService.sellCylinder(sellData, transactorId, storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Cylinder sold successfully',
    data: tx,
  });
};

/** ----------------- Cylinder marking controllers ----------------- */

/**
 * @function markDefected
 * @description Handles marking of defected cylinders
 */
export const markDefected = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId: transactorId } = req.user;
  const { storeId } = req.params;
  const { size, regulatorType } = req.query;
  const userData = req.body;
  const defectData = {
    ...userData,
    size: Number(size) || 0,
    regulatorType: String(regulatorType).trim() || '',
  };

  const cylinder = await cylinderTxService.markDefected(defectData, transactorId, storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Cylinder marked as defected successfully',
    data: cylinder,
  });
};

/**
 * @function unmarkDefected
 * @description Handles unmarking of defected cylinders
 */
export const unmarkDefected = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId: transactorId } = req.user;
  const { storeId } = req.params;
  const { size, regulatorType } = req.query;
  const userData = req.body;
  const nonDefectData = {
    ...userData,
    size: Number(size) || 0,
    regulatorType: String(regulatorType).trim() || '',
  };

  const cylinder = await cylinderTxService.unmarkDefected(nonDefectData, transactorId, storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Cylinder marked as not defected successfully',
    data: cylinder,
  });
};

/** ----------------- Cylinder exchange controllers ----------------- */

/**
 * @function exchangeFullForEmpty
 * @description Handles exchange of full cylinders between stores
 */
export const exchangeFullForEmpty = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId: transactorId } = req.user;
  const { storeId } = req.params;
  const { emptyOut, fullIn, paymentMethod } = req.body;

  const tx = await cylinderTxService.exchangeFullForEmpty(
    storeId,
    transactorId,
    emptyOut,
    fullIn,
    paymentMethod
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Full cylinders exchanged successfully',
    data: tx,
  });
};

/**
 * @function exchangeEmptyForEmpty
 * @description Handles exchange of empty cylinders between stores
 */
export const exchangeEmptyForEmpty = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId: transactorId } = req.user;
  const { storeId } = req.params;
  const { giverStoreId, cylinderOut, cylinderIn } = req.body;

  const tx = await cylinderTxService.exchangeEmptyForEmpty(
    cylinderOut,
    cylinderIn,
    giverStoreId,
    transactorId,
    storeId
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Empty cylinders exchanged successfully',
    data: tx,
  });
};

/**
 * @function getAllCylinderTransactions
 * @description Retrieves paginated list of all cylinder transactions for a store
 */
export const getAllCylinderTransactions = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { transactions: txs, total } = await cylinderTxService.allCylinderTransactions(
    storeId,
    page,
    limit
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Cylinder transactions fetched successfully',
    data: {
      total,
      page,
      limit,
      transactions: txs,
    },
  });
};

/**
 * ----------------- Default exports : cylinderTxController -----------------
 */
export default {
  buyCylinders,
  sellCylinder,

  markDefected,
  unmarkDefected,

  exchangeFullForEmpty,
  exchangeEmptyForEmpty,

  getAllCylinderTransactions,
};
