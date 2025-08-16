/**
 * @module InventoryController
 * @description Handles cylinder buying, selling, swapping.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common';
import { cylinderService, transactionService } from '@/services/v1';

// <============================> Buy Cylinders <============================>
export const buyCylinders = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId } = req.params;

  res.status(StatusCodes.CREATED).json({ message: 'Purchase recorded' });
};

export default { buyCylinders };
