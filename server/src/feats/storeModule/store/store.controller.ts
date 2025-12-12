import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { storeService } from './index.js';

import {
  seedBaseAccounts,
  seedBaseTxCategories,
  seedLocalBrands,
  seedLocalCylinders,
  seedLocalRegulators,
  seedLocalStoves,
} from '@/bootstrap/index.js';
import { withTransaction, assertAuth, assertMembership } from '@/common/index.js';

/**
 * ----------------- Write Operations -----------------
 */
export const createStore = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const store = await withTransaction(async session => {
    // 1. Create Store (Service returns store + myRole)
    const newStore = await storeService.createStore(req.body, userId, session);

    // 2. Seed Data
    await seedBaseAccounts(newStore.id);
    await seedBaseTxCategories(newStore.id);
    await seedLocalBrands(userId, newStore.id);
    await seedLocalCylinders(userId, newStore.id);
    await seedLocalRegulators(userId, newStore.id);
    await seedLocalStoves(userId, newStore.id);

    return newStore;
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Store created successfully',
    data: { store },
  });
};

export const updateStore = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId } = req.params;
  const { userId } = req.user;

  const store = await withTransaction(async session => {
    return await storeService.updateStore(storeId, userId, req.body, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Store updated successfully',
    data: { store },
  });
};

export const deleteStore = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  const store = await withTransaction(async session => {
    return await storeService.deleteStore(storeId, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Store deleted successfully',
    data: { store },
  });
};

/**
 * ----------------- Read Operations -----------------
 */
export const singleStore = async (req: Request, res: Response) => {
  assertMembership(req);
  const { storeId } = req.params;
  const { userId } = req.user;

  const store = await storeService.getSingleStore(storeId, userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Store fetched successfully',
    data: { store },
  });
};

export const allStores = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  // Extract mode
  const mode =
    req.query.mode === 'all' || req.query.mode === 'detailed'
      ? (req.query.mode as 'all' | 'detailed')
      : 'all';

  const { stores, total } = await storeService.getAllStores(userId, page, limit, mode);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Stores fetched successfully in mode: ${mode.toUpperCase()}`,
    meta: { page, limit, total },
    data: { stores },
  });
};

export default {
  createStore,
  updateStore,
  deleteStore,
  singleStore,
  allStores,
};
