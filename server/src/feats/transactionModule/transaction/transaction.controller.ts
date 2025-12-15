import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TRANSACTION_CONFIG } from './transaction.constants.js';

import { transactionService } from './index.js';

/**
 * @function getTransactionMeta
 * @description
 * Returns the dynamic list of available transaction categories.
 * Frontend uses this to build the "Add Transaction" dropdowns dynamically.
 */
export const getTransactionMeta = async (req: Request, res: Response) => {
  // Convert Config Object -> List
  const categories = Object.entries(TRANSACTION_CONFIG).map(([key, config]) => ({
    code: key,
    label: config.label,
    type: config.type,
    isSystem: !!config.isSystem,
  }));

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      categories,
      paymentMethods: ['cash', 'bank', 'mobile', 'due', 'other'],
    },
  });
};

export const getAllTransactions = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const transactions = await transactionService.getAllTransactions(storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    data: { transactions },
  });
};

export default {
  getAllTransactions,
  getTransactionMeta,
};
