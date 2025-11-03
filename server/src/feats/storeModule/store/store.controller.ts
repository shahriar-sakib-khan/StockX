/**
 * @module StoreController
 *
 * @description Controller for store related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';
import {
  seedBaseAccounts,
  seedBaseTxCategories,
  seedLocalBrands,
  seedLocalCylinders,
  seedLocalRegulators,
  seedLocalStoves,
} from '@/bootstrap/index.js';

import { storeService } from './index.js';

/**
 * ----------------- Store CRUD Controllers -----------------
 */

export const createStore = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const store = await storeService.createStore(req.body, userId);

  // Create local brands from global brands with inactive status for selection
  await seedBaseAccounts(store.id);
  await seedBaseTxCategories(store.id);
  await seedLocalBrands(userId, store.id);
  await seedLocalCylinders(userId, store.id);
  await seedLocalRegulators(userId, store.id);
  await seedLocalStoves(userId, store.id);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Store created successfully',
    data: store,
  });
};

export const singleStore = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const store = await storeService.getSingleStore(storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    data: store,
  });
};

export const updateStore = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const store = await storeService.updateStore(req.body, storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Store updated successfully',
    data: store,
  });
};

export const deleteStore = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const store = await storeService.deleteStore(storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Store deleted successfully',
    data: store,
  });
};

export const allStores = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { stores, total } = await storeService.getAllStores(userId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    meta: { page, limit, total },
    data: { stores },
  });
};

/**
 * ----------------- Store Profile Controllers -----------------
 */

export const myStoreProfile = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const storeProfile = await storeService.getMyStoreProfile(userId, storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    storeProfile,
  });
};

/**
 * ----------------- Default Exports (storeController) -----------------
 */
export default {
  createStore,
  singleStore,
  updateStore,
  deleteStore,
  allStores,

  myStoreProfile,
};
