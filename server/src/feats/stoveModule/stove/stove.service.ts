import { Types } from 'mongoose';

import Stove from './stove.model.js';
import { stoveSanitizers } from './index.js';

/**
 * ----------------- Stove Inventory -----------------
 */

/**
 * @function getStoveInventory
 * @description Retrieves the full list of stoves for a given store, sorted by creation date (latest first)
 *
 * @param {string} storeId - The ID of the store
 * @returns {Promise<any>} The sanitized stove inventory list
 */
export const getStoveInventory = async (storeId: string): Promise<any> => {
  const stoveInventoryData = await Stove.find({ store: new Types.ObjectId(storeId) }).sort({
    createdAt: -1,
  });

  return stoveSanitizers.allStoveSanitizer(stoveInventoryData, [
    'id',
    'name',
    'stoveImage',
    'burnerType',
    'price',
    'stockCount',
    'problemCount',
  ]).stoves;
};

/**
 * ----------------- Default Exports (stoveService) -----------------
 */
export default {
  getStoveInventory, // Get stove inventory for a store
};
