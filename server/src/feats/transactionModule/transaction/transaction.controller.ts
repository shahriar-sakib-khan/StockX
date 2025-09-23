/**
 * @module TransactionController
 *
 * @description Controller for transaction related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { transactionService } from './index.js';

/**
 * ----------------- Transaction Controllers -----------------
 */
export const getAllTransactions = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const transactions = await transactionService.getAllTransactions(storeId);

  res.status(StatusCodes.OK).json({ transactions });
};

/**
 * ----------------- Default Exports (transactionController) -----------------
 */
export default {
  getAllTransactions,
};
