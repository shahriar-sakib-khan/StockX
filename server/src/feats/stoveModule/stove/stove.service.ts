/**
 * @module StoveService
 *
 * @description Business logic for stove-related operations.
 */

import { Types } from 'mongoose';
import { Errors } from '@/error/index.js';
import { Stove, stoveSanitizers } from './index.js';

/**
 * ----------------- Stove Inventory Service -----------------
 */

/**
 * @function getStoveInventory
 * @description Get all active stoves for a store.
 * @param {string} storeId - The ID of the store.
 * @returns {Promise<stoveSanitizers.SanitizedStoves>} Sanitized stove data.
 */
export const getStoveInventory = async (
  storeId: string
): Promise<stoveSanitizers.SanitizedStoves> => {
  const stoves = await Stove.find({
    store: new Types.ObjectId(storeId),
  })
    .select('id name burnerCount stoveImage price stockCount defectedCount')
    .lean();

  return {
    stoves: stoveSanitizers.allStoveSanitizer(stoves, [
      'id',
      'name',
      'burnerCount',
      'stoveImage',
      'price',
      'stockCount',
      'defectedCount',
    ]).stoves,
  };
};

/**
 * ----------------- General Stove Services -----------------
 */

/**
 * @function getAllStoves
 * @description Fetches stoves for a store with pagination and mode-based detail level.
 *
 * Modes:
 * - 'active'   → Stoves with stockCount > 0
 * - 'all'      → All stoves (active + empty)
 * - 'detailed' → All stoves with full detailed data.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @param {'active' | 'all' | 'detailed'} mode - Mode of retrieval.
 * @returns {Promise<stoveSanitizers.SanitizedStoves & { total: number }>} Paginated stove data.
 */
export const getAllStoves = async (
  storeId: string,
  page: number,
  limit: number,
  mode: 'active' | 'all' | 'detailed' = 'all'
): Promise<stoveSanitizers.SanitizedStoves & { total: number }> => {
  const filter: any = { store: new Types.ObjectId(storeId) };
  if (mode === 'active') filter.stockCount = { $gt: 0 };

  const total: number = await Stove.countDocuments(filter);
  if (total === 0) return { stoves: [], total };

  const skip: number = (page - 1) * limit;
  const stoves = await Stove.find(filter).skip(skip).limit(limit).lean();

  let selectedFields: (keyof stoveSanitizers.SanitizedStove)[] | undefined;

  switch (mode) {
    case 'active':
      selectedFields = ['id', 'name', 'price', 'stockCount', 'defectedCount'];
      break;
    case 'all':
      selectedFields = ['id', 'name', 'burnerCount', 'price', 'stockCount', 'defectedCount'];
      break;
    case 'detailed':
      selectedFields = undefined;
      break;
  }

  return {
    stoves: stoveSanitizers.allStoveSanitizer(stoves, selectedFields).stoves,
    total,
  };
};

/**
 * @function updateStovePrice
 * @description Updates the price of a single stove by ID.
 *
 * @param {string} id - Stove ID.
 * @param {number} price - New price to set.
 * @param {string} storeId - Store ID.
 * @param {string} userId - ID of the user updating.
 * @returns {Promise<stoveSanitizers.SanitizedStove>} Updated stove data.
 */
export const updateStovePrice = async (
  id: string,
  price: number,
  storeId: string,
  userId: string
): Promise<stoveSanitizers.SanitizedStove> => {
  const stove = await Stove.findById(id).select('id store price');

  if (!stove) throw new Errors.NotFoundError('Stove not found.');
  if (stove.store.toString() !== storeId)
    throw new Errors.BadRequestError('Invalid stove or store mismatch.');

  stove.price = price;
  stove.updatedBy = new Types.ObjectId(userId);

  await stove.save();

  return stoveSanitizers.stoveSanitizer(stove);
};

/**
 * ----------------- Default Exports (stoveService) -----------------
 */
export default {
  getStoveInventory,
  getAllStoves,
  updateStovePrice,
};
