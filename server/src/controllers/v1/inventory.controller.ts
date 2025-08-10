/**
 * @module InventoryController
 *
 * @description This module contains the controller functions for the inventory routes.
 */

import { assertAuth } from '@/common';
import { brandService } from '@/services/v1';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// <============================> Local Brand Controllers <============================>

export const allLocalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { workspaceId, divisionId } = req.params;

  const { localBrands, total } = await brandService.getLocalBrands(
    page,
    limit,
    workspaceId,
    divisionId
  );

  res.status(StatusCodes.OK).json({ total, page, limit, localBrands });
};

export const detailedLocalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { workspaceId, divisionId } = req.params;

  const { localBrands, total } = await brandService.detailedLocalBrands(
    page,
    limit,
    workspaceId,
    divisionId
  );

  res.status(StatusCodes.OK).json({ total, page, limit, localBrands });
};

export const selectBrands = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const updateStats = await brandService.selectLocalBrands(req.body, userId);

  res.status(StatusCodes.OK).json({ updateStats });
};

export default { allLocalBrands, detailedLocalBrands, selectBrands };
