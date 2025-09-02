/**
 * @module InventoryController
 * @description Handles cylinder buying, selling, swapping.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common';
import { cylinderService, transactionService } from '@/services/v1';

// <============================> General Transactions Controllers <============================>
export const allTransactions = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;

  const transactions = await transactionService.getAllTransactions(divisionId, workspaceId);

  res.status(StatusCodes.OK).json({ transactions });
};

// <============================> Buy Cylinders <============================>
export const buyCylinders = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId } = req.params;

  const tx = await transactionService.recordPurchase(req.body, userId, divisionId, workspaceId);
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

  buyCylinders,
};
