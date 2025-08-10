/**
 * @module AdminController
 *
 * @description This module contains the controller functions for the admin (ostad) routes.
 * These routes are only accessible to users with the "ostad" role.
 *
 * Global brand controllers:
 * - Get all global brands
 * - Get detailed global brands
 * - Add a new global brand
 * - Remove a global brand
 * - Update a global brand
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { brandService } from '@/services/v1';

export const allGlobalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { globalBrands, total } = await brandService.getGlobalBrands(page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, globalBrands });
};

export const detailedGlobalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { globalBrands, total } = await brandService.getDetailedGlobalBrands(page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, globalBrands });
};

export const addGlobalBrand = async (req: Request, res: Response) => {
  const newBrand = brandService.addGlobalBrand();
  res.status(StatusCodes.OK).json({ newBrand });
};

export default { allGlobalBrands, addGlobalBrand, detailedGlobalBrands };
