import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { globalBrandService } from './index.js';

export const allGlobalBrands = async (_req: Request, res: Response) => {
  const brands = await globalBrandService.getAllGlobalBrands();

  res.status(StatusCodes.OK).json({ total: brands.length, brands });
};

export const getSingleGlobalBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  const brand = await globalBrandService.getGlobalBrandById(id);

  res.status(StatusCodes.OK).json({ brand });
};

export const createGlobalBrand = async (req: Request, res: Response) => {
  const brand = await globalBrandService.createGlobalBrand(req.body, req.files as any);

  res.status(StatusCodes.CREATED).json({ message: 'Brand created successfully', brand });
};

export const updateGlobalBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  const brand = await globalBrandService.updateGlobalBrand(id, req.body, req.files as any);

  res.status(StatusCodes.OK).json({ message: 'Brand updated successfully', brand });
};

export const deleteGlobalBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  await globalBrandService.deleteGlobalBrand(id);

  res.status(StatusCodes.OK).json({ message: 'Brand deleted successfully' });
};

export default {
  allGlobalBrands,
  getSingleGlobalBrand,
  createGlobalBrand,
  updateGlobalBrand,
  deleteGlobalBrand,
};
