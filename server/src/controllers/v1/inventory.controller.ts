/**
 * @module InventoryController
 *
 * @description This module contains the controller functions for the inventory routes.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common';
import { brandService, cylinderService } from '@/services/v1';
import { seedLocalCylinders } from '@/services/v1/inventory/cylinders.service';

// <============================> Brand Controllers <============================>

export const allGlobalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { globalBrands, total } = await brandService.getGlobalBrands(page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, globalBrands });
};

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

  const { workspaceId, divisionId } = req.params;
  await seedLocalCylinders(req.body, workspaceId, divisionId, userId);

  res.status(StatusCodes.OK).json({ updateStats });
};

// <============================> Cylinder Controllers <============================>

export const allCylinders = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { workspaceId, divisionId } = req.params;

  const { cylinders, total } = await cylinderService.getCylinders(
    page,
    limit,
    workspaceId,
    divisionId
  );

  res.status(StatusCodes.OK).json({ total, page, limit, cylinders });
};

export const changeCylinderCount = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId, cylinderId } = req.params;

  const { cylinders, updateStats } = await cylinderService.changeCylinderCount(
    req.body,
    cylinderId,
    userId
  );

  res.status(StatusCodes.OK).json({ updateStats, cylinders });
};

export default {
  allGlobalBrands,
  allLocalBrands,
  detailedLocalBrands,
  selectBrands,

  allCylinders,
  changeCylinderCount,
};
