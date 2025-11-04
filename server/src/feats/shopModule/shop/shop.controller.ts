/**
 * @module ShopController
 *
 * @description Controller for managing client shops under a store.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { assertAuth } from '@/common/assertions.js';
import { shopService } from './index.js';

/**
 * ----------------- Create -----------------
 */
export const createShop = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const shop = await shopService.createShop(req.body, userId, storeId);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Shop created successfully',
    data: shop,
  });
};

/**
 * ----------------- Get All -----------------
 */
export const getAllShops = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { shops, total } = await shopService.getAllShops(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Shops fetched successfully ${shops.length === 0 ? ': No shops found' : ''}`,
    pagination: { total, page, limit },
    data: shops,
  });
};

/**
 * ----------------- Get Single -----------------
 */
export const getSingleShop = async (req: Request, res: Response) => {
  const { storeId, shopId } = req.params;
  const shop = await shopService.getShopById(storeId, shopId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Shop fetched successfully',
    data: shop,
  });
};

/**
 * ----------------- Update -----------------
 */
export const updateShop = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId, shopId } = req.params;
  const updated = await shopService.updateShop(req.body, userId, storeId, shopId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Shop updated successfully',
    data: updated,
  });
};

/**
 * ----------------- Delete -----------------
 */
export const deleteShop = async (req: Request, res: Response) => {
  const { storeId, shopId } = req.params;
  const deleted = await shopService.deleteShop(storeId, shopId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Shop deleted successfully',
    data: deleted,
  });
};

export default { createShop, getAllShops, getSingleShop, updateShop, deleteShop };
