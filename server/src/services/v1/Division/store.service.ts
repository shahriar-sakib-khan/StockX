/**
 * @module store.service
 *
 * @description Services for store-related operations within workspace divisions.
 * Handles CRUD, sanitization, and pagination.
 */

import { Types } from 'mongoose';
import { Store, IStore } from '@/models';
import { Errors } from '@/error';
import { store } from '@/validations';
import { storeSanitizers } from '@/utils';

/**
 * @function createStore
 * @description Create a new store under a specific workspace and division.
 *
 * @param {store.StoreInput} storeData - Store creation data.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<storeSanitizers.SanitizedStore>} Created store.
 */
export const createStore = async (
  storeData: store.StoreInput,
  workspaceId: string,
  divisionId: string
): Promise<storeSanitizers.SanitizedStore> => {
  const { name, contactName, phone, address } = storeData;

  // Check for duplicate name in the same division
  const existing = await Store.exists({
    name,
    workspace: workspaceId,
    division: divisionId,
  });
  if (existing) throw new Errors.BadRequestError('Store with this name already exists');

  const newStore = await Store.create({
    name,
    contactName,
    phone,
    address,
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  });

  return storeSanitizers.storeSanitizer(newStore);
};

/**
 * @function getSingleStore
 * @description Get a single store by ID within a workspace and division.
 *
 * @param {string} storeId - Store ID.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<storeSanitizers.SanitizedStore>} Store document.
 */
export const getSingleStore = async (
  storeId: string,
  workspaceId: string,
  divisionId: string
): Promise<storeSanitizers.SanitizedStore> => {
  const storeDoc = await Store.findOne({
    _id: storeId,
    workspace: workspaceId,
    division: divisionId,
  }).lean();

  if (!storeDoc) throw new Errors.NotFoundError('Store not found');

  return storeSanitizers.storeSanitizer(storeDoc);
};

/**
 * @function updateStore
 * @description Update store fields.
 *
 * @param {string} storeId - Store ID.
 * @param {Partial<IStore>} storeData - Fields to update.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<storeSanitizers.SanitizedStore>} Updated store document.
 */
export const updateStore = async (
  storeId: string,
  storeData: Partial<IStore>,
  workspaceId: string,
  divisionId: string
): Promise<storeSanitizers.SanitizedStore> => {
  const updatedStore = await Store.findOneAndUpdate(
    { _id: storeId, workspace: workspaceId, division: divisionId },
    storeData,
    { new: true, runValidators: true }
  ).lean();

  if (!updatedStore) throw new Errors.NotFoundError('Store not found');

  return storeSanitizers.storeSanitizer(updatedStore);
};

/**
 * @function deleteStore
 * @description Delete a store by ID within a workspace and division.
 *
 * @param {string} storeId - Store ID.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<storeSanitizers.SanitizedStore>} Deleted store.
 */
export const deleteStore = async (
  storeId: string,
  workspaceId: string,
  divisionId: string
): Promise<storeSanitizers.SanitizedStore> => {
  const deletedStore = await Store.findOneAndDelete({
    _id: storeId,
    workspace: workspaceId,
    division: divisionId,
  }).lean();

  if (!deletedStore) throw new Errors.NotFoundError('Store not found');

  return storeSanitizers.storeSanitizer(deletedStore);
};

/**
 * @function getAllStores
 * @description Get paginated stores for a workspace and division.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {number} page - Page number.
 * @param {number} limit - Records per page.
 * @returns {Promise<storeSanitizers.SanitizedStores & { total: number }>} Paginated stores.
 */
export const getAllStores = async (
  workspaceId: string,
  divisionId: string,
  page: number,
  limit: number
): Promise<storeSanitizers.SanitizedStores & { total: number }> => {
  const total = await Store.countDocuments({ workspace: workspaceId, division: divisionId });
  if (total === 0) return { stores: [], total };

  const skip: number = (page - 1) * limit;
  const stores = await Store.find({ workspace: workspaceId, division: divisionId })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    stores: storeSanitizers.allStoreSanitizer(stores, [
      'id',
      'name',
      'contactName',
      'phone',
      'address',
    ]).stores,
    total,
  };
};

/**
 * ----------------- Store Services (default export) -----------------
 */
export default {
  createStore, // Create a new store
  getSingleStore, // Get a single store by ID
  updateStore, // Update an existing store
  deleteStore, // Delete a store
  getAllStores, // Get all stores with pagination
};
