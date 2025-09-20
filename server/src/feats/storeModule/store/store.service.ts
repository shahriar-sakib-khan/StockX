/**
 * @module store.service
 *
 * @description Services for store related operations:
 */

import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';

import { Membership, membershipSanitizers } from '../index.js';
import { Store, storeValidator, storeSanitizers } from './index.js';

/**
 * @function createStore
 * @description Creates a new store for the given user.
 * Returns only sanitized store fields.
 *
 * @param {storeValidator.CreateStoreInput} storeData - Store creation data.
 * @param {string} userId - The creator's user ID.
 * @returns {Promise<storeSanitizers.SanitizedStore>} The sanitized store object.
 * @throws {Errors.BadRequestError} If a store with the same name already exists for the user.
 */
export const createStore = async (
  storeData: storeValidator.CreateStoreInput,
  userId: string
): Promise<storeSanitizers.SanitizedStore> => {
  const { name, description, image, location, phone } = storeData;

  // Prevent duplicate store names for the same user
  const existingStore = await Store.exists({ name, createdBy: userId });
  if (existingStore) {
    throw new Errors.BadRequestError('Store name already exists');
  }

  // Create the store
  const store = await Store.create({
    name,
    description,
    image,
    location,
    phone,
    createdBy: new Types.ObjectId(userId),
  });

  // Create a membership for the creator
  await Membership.create({
    store: store._id,
    user: new Types.ObjectId(userId),
    storeRoles: ['owner', 'admin'],
    status: 'active',
  });

  return storeSanitizers.storeSanitizer(store);
};

/**
 * @function getAllStores
 * @description Retrieves all stores created by a specific user, with pagination.
 *
 * @param {string} userId - The creator's user ID.
 * @param {number} page - Current page number for pagination.
 * @param {number} limit - Max number of stores per page.
 * @returns {Promise<storeSanitizers.SanitizedStores & { total: number }>} List of sanitized stores with total count.
 */
export const getAllStores = async (
  userId: string,
  page: number,
  limit: number
): Promise<storeSanitizers.SanitizedStores & { total: number }> => {
  const total: number = await Store.countDocuments({ createdBy: userId });
  if (total === 0) return { stores: [], total };

  const skip: number = (page - 1) * limit;
  const stores = await Store.find({ createdBy: userId }).skip(skip).limit(limit).lean();

  return {
    stores: storeSanitizers.allStoreSanitizer(stores, ['id', 'name', 'image', 'location', 'phone'])
      .stores,
    total,
  };
};

/**
 * @function getSingleStore
 * @description Retrieves a single store by its unique _id.
 *
 * @param {string} storeId - The store's unique ID.
 * @returns {Promise<storeSanitizers.SanitizedStore>} Sanitized store document.
 * @throws {Errors.NotFoundError} If store not found.
 */
export const getSingleStore = async (storeId: string): Promise<storeSanitizers.SanitizedStore> => {
  const store = await Store.findById(storeId).lean();

  if (!store) throw new Errors.NotFoundError('Store not found');

  return storeSanitizers.storeSanitizer(store);
};

/**
 * @function updateStore
 * @description Updates a store's details.
 *
 * @param {storeValidator.UpdateStoreInput} storeData - Store update data.
 * @param {string} storeId - The store's unique ID.
 * @returns {Promise<storeSanitizers.SanitizedStore>} Updated sanitized store document.
 * @throws {Errors.NotFoundError} If store not found.
 */
export const updateStore = async (
  storeData: storeValidator.UpdateStoreInput,
  storeId: string
): Promise<storeSanitizers.SanitizedStore> => {
  const { name, description, image, location, phone } = storeData;

  // Prevent duplicate store names for the same user
  const existingStore = await Store.exists({ name, _id: { $ne: storeId } });
  if (existingStore) {
    throw new Errors.BadRequestError('Store name already exists');
  }

  const store = await Store.findByIdAndUpdate(
    storeId,
    { name, description, image, location, phone },
    { new: true }
  )
    .select('name description image location phone')
    .lean();

  if (!store) throw new Errors.NotFoundError('Store not found');

  return storeSanitizers.storeSanitizer(store);
};

/**
 * @function deleteStore
 * @description Deletes a store by its ID.
 *
 * @param {string} storeId - The store's unique ID.
 * @returns {Promise<storeSanitizers.SanitizedStore>} Deleted sanitized store document.
 * @throws {Errors.NotFoundError} If store not found.
 */
export const deleteStore = async (storeId: string): Promise<storeSanitizers.SanitizedStore> => {
  const store = await Store.findByIdAndDelete(storeId)
    .select('name description image location phone')
    .lean();

  if (!store) throw new Errors.NotFoundError('Store not found');

  return storeSanitizers.storeSanitizer(store);
};

/**
 * ----------------- User's Store Profile Services -----------------
 */

/**
 * @function getMyStoreProfile
 * @description Retrieve the current user's membership profile for a specific store.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} storeId - The ID of the store.
 * @returns {Promise<membershipSanitizers.SanitizedMembership>}
 * Sanitized store membership document.
 * @throws {Errors.NotFoundError} If the membership or store is not found.
 */
export const getMyStoreProfile = async (
  userId: string,
  storeId: string
): Promise<membershipSanitizers.SanitizedMembership> => {
  const storeProfile = await Membership.findOne({
    user: userId,
    store: storeId,
  })
    .populate('user', 'username email') // Only expose safe fields
    .populate('store', 'name location') // Minimal store data
    .lean();

  if (!storeProfile) {
    throw new Errors.NotFoundError('Store membership profile not found');
  }

  return membershipSanitizers.membershipSanitizer(storeProfile);
};

/**
 * ----------------- Default Exports (storeService) -----------------
 */
export default {
  createStore, // Create a new store
  getAllStores, // Retrieve all stores for a user (with pagination)
  getSingleStore, // Fetch a single store by its ID
  updateStore, // Update store details
  deleteStore, // Delete a store by its ID

  getMyStoreProfile, // Retrieve the current user's membership profile for a specific store
};
