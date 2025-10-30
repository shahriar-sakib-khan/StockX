import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { Regulator, regulatorSanitizers } from './index.js';

/**
 * ----------------- Regulator Inventory Service -----------------
 */

/**
 * @function getRegulatorInventory
 * @description Get all active regulators for a store.
 * @param {string} storeId - The ID of the store.
 * @returns {Promise<regulatorSanitizers.SanitizedRegulators>} Sanitized regulator data.
 */
export const getRegulatorInventory = async (
  storeId: string
): Promise<regulatorSanitizers.SanitizedRegulators> => {
  const regulators = await Regulator.find({
    store: new Types.ObjectId(storeId),
  })
    .select('id name regulatorType regulatorImage price stockCount defectedCount')
    .lean();

  return {
    regulators: regulatorSanitizers.allRegulatorSanitizer(regulators, [
      'id',
      'name',
      'regulatorType',
      'regulatorImage',
      'price',
      'stockCount',
      'defectedCount',
    ]).regulators,
  };
};

/**
 * ----------------- General Regulator Services -----------------
 */

/**
 * @function getAllRegulators
 * @description Fetches regulators for a store with pagination and mode-based detail level.
 *
 * Modes:
 * - 'active'   → Regulators with stockCount > 0
 * - 'all'      → All regulators (active + empty)
 * - 'detailed' → All regulators with full detailed data.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @param {'active' | 'all' | 'detailed'} mode - Mode of retrieval.
 * @returns {Promise<regulatorSanitizers.SanitizedRegulators & { total: number }>} Paginated regulator data.
 */
export const getAllRegulators = async (
  storeId: string,
  page: number,
  limit: number,
  mode: 'active' | 'all' | 'detailed' = 'all'
): Promise<regulatorSanitizers.SanitizedRegulators & { total: number }> => {
  const filter: any = { store: new Types.ObjectId(storeId) };
  if (mode === 'active') filter.stockCount = { $gt: 0 };

  const total: number = await Regulator.countDocuments(filter);
  if (total === 0) return { regulators: [], total };

  const skip: number = (page - 1) * limit;
  const regulators = await Regulator.find(filter).skip(skip).limit(limit).lean();

  let selectedFields: (keyof regulatorSanitizers.SanitizedRegulator)[] | undefined;

  switch (mode) {
    case 'active':
      selectedFields = ['id', 'name', 'price', 'stockCount', 'defectedCount'];
      break;
    case 'all':
      selectedFields = ['id', 'name', 'regulatorType', 'price', 'stockCount', 'defectedCount'];
      break;
    case 'detailed':
      selectedFields = undefined; // Return all fields
      break;
  }

  return {
    regulators: regulatorSanitizers.allRegulatorSanitizer(regulators, selectedFields).regulators,
    total,
  };
};

/**
 * @function updateRegulatorPrice
 * @description Updates the price of a single regulator by ID.
 *
 * @param {string} id - Regulator ID.
 * @param {number} price - New price to set.
 * @param {string} storeId - Store ID.
 * @param {string} userId - ID of the user updating.
 * @returns {Promise<regulatorSanitizers.SanitizedRegulator>} Updated regulator data.
 */
export const updateRegulatorPrice = async (
  id: string,
  price: number,
  storeId: string,
  userId: string
): Promise<regulatorSanitizers.SanitizedRegulator> => {
  const regulator = await Regulator.findById(id).select('id store price');

  if (!regulator) throw new Errors.NotFoundError('Regulator not found.');
  if (regulator.store.toString() !== storeId)
    throw new Errors.BadRequestError('Invalid regulator or store mismatch.');

  regulator.price = price;
  regulator.updatedBy = new Types.ObjectId(userId);

  await regulator.save();

  return regulatorSanitizers.regulatorSanitizer(regulator);
};

/**
 * ----------------- Default Exports (regulatorService) -----------------
 */
export default {
  getRegulatorInventory,

  getAllRegulators,
  updateRegulatorPrice,
};
