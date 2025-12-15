import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { shopService } from './index.js';

import { assertMembership, withTransaction } from '@/common/index.js';

export const createShop = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const shop = await withTransaction(async session => {
    return await shopService.createShop(req.body, userId, storeId, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Shop created successfully',
    data: { shop },
  });
};

export const updateShop = async (req: Request, res: Response) => {
  assertMembership(req);
  const { userId } = req.user;
  const { storeId, shopId } = req.params;

  const shop = await withTransaction(async session => {
    return await shopService.updateShop(shopId, storeId, userId, req.body, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Shop updated successfully',
    data: { shop },
  });
};

export const deleteShop = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId, shopId } = req.params;

  const shop = await withTransaction(async session => {
    return await shopService.deleteShop(shopId, storeId, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Shop deleted successfully',
    data: { shop },
  });
};

export const getAllShops = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { shops, total } = await shopService.getAllShops(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Shops fetched successfully',
    meta: { page, limit, total },
    data: { shops },
  });
};

export const getSingleShop = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId, shopId } = req.params;

  const shop = await shopService.getShopById(shopId, storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Shop fetched successfully',
    data: { shop },
  });
};

export default {
  createShop,
  updateShop,
  deleteShop,
  getAllShops,
  getSingleShop,
};
