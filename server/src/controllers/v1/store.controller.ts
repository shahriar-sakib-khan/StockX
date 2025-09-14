/**
 * @module StoreController
 *
 * @description Controller for store related operations within workspace divisions.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { storeService } from '@/services/v1/index.js';

/**
 * ----------------- Store CRUD Controllers -----------------
 */

/**
 * @function createStore
 * @desc Create a new store in a division
 * @route POST /:workspaceId/divisions/:divisionId/stores
 * @access Admin (division)
 */
export const createStore = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;

  const store = await storeService.createStore(req.body, workspaceId, divisionId);

  res.status(StatusCodes.CREATED).json({ message: 'Store created successfully', store });
};

/**
 * @function getStores
 * @desc Get all stores in a division with pagination
 * @route GET /:workspaceId/divisions/:divisionId/stores
 * @access Authenticated (division)
 */
export const getStores = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { stores, total } = await storeService.getAllStores(workspaceId, divisionId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, stores });
};

/**
 * @function getSingleStore
 * @desc Get a single store by ID
 * @route GET /:workspaceId/divisions/:divisionId/stores/:storeId
 * @access Authenticated (division)
 */
export const getSingleStore = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, storeId } = req.params;

  const store = await storeService.getSingleStore(storeId, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ store });
};

/**
 * @function updateStore
 * @desc Update a store
 * @route PUT /:workspaceId/divisions/:divisionId/stores/:storeId
 * @access Admin (division)
 */
export const updateStore = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, storeId } = req.params;

  const store = await storeService.updateStore(storeId, req.body, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ message: 'Store updated successfully', store });
};

/**
 * @function deleteStore
 * @desc Delete a store
 * @route DELETE /:workspaceId/divisions/:divisionId/stores/:storeId
 * @access Admin (division)
 */
export const deleteStore = async (req: Request, res: Response) => {
  const { workspaceId, divisionId, storeId } = req.params;

  const store = await storeService.deleteStore(storeId, workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ message: 'Store deleted successfully', store });
};

/**
 * ----------------- Store Controllers (default export) -----------------
 */
export default {
  createStore, // Create a new store
  getStores, // Get all stores in a division
  getSingleStore, // Get a single store by ID
  updateStore, // Update a store
  deleteStore, // Delete a store
};
