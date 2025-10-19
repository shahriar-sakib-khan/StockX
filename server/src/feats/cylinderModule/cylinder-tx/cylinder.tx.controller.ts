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

/**
 * ----------------- Cylinder buy and sell controllers -----------------
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

  res.status(StatusCodes.CREATED).json(tx);
};

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

  res.status(StatusCodes.OK).json(tx);
};

/**
 * ----------------- Cylinder marking controllers -----------------
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

  res.status(StatusCodes.OK).json(cylinder);
};

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

  res.status(StatusCodes.OK).json(cylinder);
};

/**
 * ----------------- Cylinder exchange controllers -----------------
 */
export const exchangeFullForEmpty = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId: transactorId } = req.user;
  const { storeId } = req.params;
  const { emptyOut, fullIn, paymentMethod } = req.body;

  const Tx = await cylinderTxService.exchangeFullForEmpty(
    storeId,
    transactorId,
    emptyOut,
    fullIn,
    paymentMethod
  );

  res.status(StatusCodes.OK).json(Tx);
};

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

  res.status(StatusCodes.OK).json(tx);
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
};
