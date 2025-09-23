/**
 * @module GlobalBrandController
 *
 * @description Controller for managing global brands.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { globalBrandService } from './index.js';

/**
 * ----------------- Create Global Brand -----------------
 */
export const createGlobalBrand = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const globalBrand = await globalBrandService.createGlobalBrand(req.body, userId);

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Global brand created successfully', globalBrand });
};

/**
 * ----------------- Get All Global Brands -----------------
 */
export const getAllGlobalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { globalBrands, total } = await globalBrandService.getAllGlobalBrands(page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, globalBrands });
};

/**
 * ----------------- Get Detailed Global Brands -----------------
 */
export const getDetailedGlobalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { globalBrands, total } = await globalBrandService.getDetailedGlobalBrands(page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, globalBrands });
};

/**
 * ----------------- Get Single Global Brand -----------------
 */
export const getGlobalBrandById = async (req: Request, res: Response) => {
  const { brandId } = req.params;

  const globalBrand = await globalBrandService.getGlobalBrandById(brandId);

  res.status(StatusCodes.OK).json({ globalBrand });
};

/**
 * ----------------- Update Global Brand -----------------
 */
export const updateGlobalBrand = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { brandId } = req.params;

  const updatedBrand = await globalBrandService.updateGlobalBrand(req.body, userId, brandId);

  res.status(StatusCodes.OK).json({ message: 'Global brand updated successfully', updatedBrand });
};

/**
 * ----------------- Delete Global Brand -----------------
 */
export const deleteGlobalBrand = async (req: Request, res: Response) => {
  assertAuth(req);
  const { brandId } = req.params;

  const deletedBrand = await globalBrandService.deleteGlobalBrand(brandId);

  res.status(StatusCodes.OK).json({ message: 'Global brand deleted successfully', deletedBrand });
};

/**
 * ----------------- Default Exports (globalBrandController) -----------------
 */
export default {
  createGlobalBrand,
  getAllGlobalBrands,
  getDetailedGlobalBrands,
  getGlobalBrandById,
  updateGlobalBrand,
  deleteGlobalBrand,
};
