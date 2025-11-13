/**
 * @module ExchangeController
 *
 * @description Controller for cylinder exchange operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { exchangeService } from './index.js';

/**
 * ----------------- Create Cylinder Exchange -----------------
 */
export const createExchange = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const payload = req.body;

  const ex = await exchangeService.createExchange(payload, userId);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Cylinder exchange recorded successfully.',
    data: ex,
  });
};

// /**
//  * ----------------- Get All Exchanges (Paginated) -----------------
//  */
// export const getAllExchanges = async (req: Request, res: Response) => {
//   const { storeId } = req.params;

//   const page = Math.max(Number(req.query.page) || 1, 1);
//   const limit = Math.min(Number(req.query.limit) || 20, 100);

//   const { exchanges, total } = await exchangeService.getAllExchanges(storeId, page, limit);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: 'Exchanges fetched successfully.',
//     meta: { page, limit, total },
//     data: exchanges,
//   });
// };

// /**
//  * ----------------- Get Single Exchange -----------------
//  */
// export const getExchangeById = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   const exchange = await exchangeService.getExchangeById(id);

//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: 'Exchange details fetched successfully.',
//     data: exchange,
//   });
// };

/**
 * ----------------- Default Export -----------------
 */
export default {
  createExchange,
  //   getAllExchanges,
  //   getExchangeById,
};
