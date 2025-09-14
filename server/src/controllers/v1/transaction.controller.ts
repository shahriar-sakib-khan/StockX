/**
 * @module InventoryController
 * @description Handles cylinder buying, selling, swapping.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/index.js';
import { transactionService } from '@/services/v1/index.js';

// <============================> General Transactions Controllers <============================>
export const allTransactions = async (req: Request, res: Response) => {
  const page: number = Math.max(Number(req.query.page) || 1, 1);
  const limit: number = Math.min(Number(req.query.limit) || 20, 100);
  const { workspaceId, divisionId } = req.params;

  const { transactions, total } = await transactionService.getAllTransactions(
    page,
    limit,
    workspaceId,
    divisionId
  );

  res.status(StatusCodes.OK).json({ total, page, limit, transactions });
};

export const singleTransaction = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, transactionId } = req.params;

  const transaction = await transactionService.getSingleTransaction(
    workspaceId,
    divisionId,
    transactionId
  );

  res.status(StatusCodes.OK).json({ transaction });
};

export const allTxCategories = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;

  const categories = await transactionService.getAllTxCategories(workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ categories });
};

// <============================> Buy Cylinders <============================>
export const buyCylinders = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId } = req.params;

  const tx = await transactionService.recordTransaction(req.body, userId, divisionId, workspaceId);
  // const updatedCylinder = await cylinderService.increaseStock(divisionId, workspaceId);

  res.status(StatusCodes.CREATED).json({ message: 'Purchase recorded', tx });
};

// export const buyCylinders = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { workspaceId, divisionId } = req.params;

//   res.status(StatusCodes.CREATED).json({ message: 'Purchase recorded' });
// };

// // <============================> Sell Cylinders <============================>
// export const sellCylinders = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { workspaceId, divisionId } = req.params;
//   const { customerId, brandId, quantity, unitPrice, paymentMethod, due } = req.body;

//   const updatedCylinder = await cylinderService.decreaseStock(
//     workspaceId,
//     divisionId,
//     brandId,
//     quantity
//   );
//   await transactionService.recordSale({
//     workspaceId,
//     divisionId,
//     customerId,
//     brandId,
//     quantity,
//     unitPrice,
//     paymentMethod,
//     due,
//     createdBy: userId,
//   });

//   res.status(StatusCodes.CREATED).json({ message: 'Sale recorded', updatedCylinder });
// };

// // <============================> Swap Cylinders <============================>
// export const swapCylinders = async (req: Request, res: Response) => {
//   assertAuth(req);
//   const { userId } = req.user;
//   const { workspaceId, divisionId } = req.params;
//   const { givenBrandId, receivedBrandId, customerId } = req.body;

//   await cylinderService.swapCylinders(workspaceId, divisionId, givenBrandId, receivedBrandId);
//   await transactionService.recordSwap({
//     workspaceId,
//     divisionId,
//     givenBrandId,
//     receivedBrandId,
//     customerId,
//     createdBy: userId,
//   });

//   res.status(StatusCodes.CREATED).json({ message: 'Swap recorded' });
// };

export default {
  allTransactions,
  singleTransaction,
  allTxCategories,

  buyCylinders,
};
