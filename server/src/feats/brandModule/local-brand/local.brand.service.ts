import { Types } from 'mongoose';

import { LocalBrand, localBrandSanitizers, localBrandValidator } from './index.js';

/**
 * @function getActiveLocalBrands
 * Fetches all active local brands for a store with pagination.
 *
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @param {string} storeId - Store ID.
 * @returns {Promise<localBrandSanitizers.SanitizedLocalBrands & { total: number }>} Paginated active local brands.
 */
export const getActiveLocalBrands = async (
  page: number,
  limit: number,
  storeId: string
): Promise<localBrandSanitizers.SanitizedLocalBrands & { total: number }> => {
  const total: number = await LocalBrand.countDocuments({
    store: new Types.ObjectId(storeId),
    isActive: true,
  });
  if (total === 0) return { localBrands: [], total };

  const skip: number = (page - 1) * limit;
  const localBrands = await LocalBrand.find({ store: storeId, isActive: true })
    .skip(skip)
    .limit(limit)
    .select('id name brandImage')
    .lean();

  return {
    localBrands: localBrandSanitizers.allLocalBrandSanitizer(localBrands, [
      'id',
      'name',
      'brandImage',
    ]).localBrands,
    total,
  };
};

/**
 * @function getAllLocalBrands
 * Fetches all local brands for a store with pagination.
 *
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @param {string} storeId - Store ID.
 * @returns {Promise<localBrandSanitizers.SanitizedLocalBrands & { total: number }>} Paginated local brands.
 */
export const getAllLocalBrands = async (
  page: number,
  limit: number,
  storeId: string
): Promise<localBrandSanitizers.SanitizedLocalBrands & { total: number }> => {
  const total: number = await LocalBrand.countDocuments({ store: new Types.ObjectId(storeId) });
  if (total === 0) return { localBrands: [], total };

  const skip: number = (page - 1) * limit;
  const localBrands = await LocalBrand.find({ store: storeId })
    .skip(skip)
    .limit(limit)
    .select('id name brandImage isActive')
    .lean();

  return {
    localBrands: localBrandSanitizers.allLocalBrandSanitizer(localBrands, [
      'id',
      'name',
      'brandImage',
      'isActive',
    ]).localBrands,
    total,
  };
};

/**
 * @function detailedLocalBrands
 * Fetches detailed local brand data for a store with pagination.
 *
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @param {string} storeId - Store ID.
 * @returns {Promise<localBrandSanitizers.SanitizedLocalBrands & { total: number }>} Paginated detailed local brands.
 */
export const detailedLocalBrands = async (
  page: number,
  limit: number,
  storeId: string
): Promise<localBrandSanitizers.SanitizedLocalBrands & { total: number }> => {
  const total: number = await LocalBrand.countDocuments({ store: new Types.ObjectId(storeId) });
  if (total === 0) return { localBrands: [], total };

  const skip: number = (page - 1) * limit;
  const localBrands = await LocalBrand.find({ store: storeId }).skip(skip).limit(limit).lean();

  return {
    localBrands: localBrandSanitizers.allLocalBrandSanitizer(localBrands).localBrands,
    total,
  };
};

/**
 * @function selectLocalBrands
 * Updates the user's selection of local brands.
 *
 * @param {localBrandValidator.LocalBrandSelectionInput} selectedBrands - Array of selected brand objects.
 * @param {string} userId - ID of the user making the selection.
 * @returns {Promise<{ updatedCount: number }>} Number of updated records.
 */
export const selectLocalBrands = async (
  selectedBrands: localBrandValidator.LocalBrandSelectionInput,
  userId: string
): Promise<{ updatedCount: number }> => {
  const bulkOps = selectedBrands.map(({ id, isActive }) => ({
    updateOne: {
      filter: { _id: id },
      update: { isActive, selectedBy: new Types.ObjectId(userId) },
    },
  }));

  const result = await LocalBrand.bulkWrite(bulkOps);

  return { updatedCount: result.modifiedCount };
};

/**
 * ----------------- Default Exports (localBrandService) -----------------
 */
export default {
  getActiveLocalBrands, // Get all active local brands for a store
  getAllLocalBrands, // Get all local brands for a store
  detailedLocalBrands, // Get detailed local brands for a store
  selectLocalBrands, // Update user's selected local brands
};
