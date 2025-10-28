import { Types } from 'mongoose';

import { LocalBrand, localBrandSanitizers, localBrandValidator } from './index.js';
import { Cylinder } from '@/models/index.js';

/**
 * ----------------- Unified Local Brand Fetch Service -----------------
 *
 * @function getAllLocalBrands
 * @description Fetches local brands for a store with pagination and mode-based detail level.
 *
 * Modes:
 * - 'active'   → Only active brands.
 * - 'all'      → All brands (active + inactive).
 * - 'detailed' → All brands with full detailed data.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Items per page.
 * @param {'active' | 'all' | 'detailed'} mode - Mode of retrieval.
 * @returns {Promise<localBrandSanitizers.SanitizedLocalBrands & { total: number }>}
 */
export const getAllLocalBrands = async (
  storeId: string,
  page: number,
  limit: number,
  mode: 'active' | 'all' | 'detailed' = 'all'
): Promise<localBrandSanitizers.SanitizedLocalBrands & { total: number }> => {
  const filter: any = { store: new Types.ObjectId(storeId) };
  if (mode === 'active') filter.isActive = true;

  const total: number = await LocalBrand.countDocuments(filter);
  if (total === 0) return { localBrands: [], total };

  const skip: number = (page - 1) * limit;

  const localBrands = await LocalBrand.find(filter).skip(skip).limit(limit).lean();

  // Field selection based on mode
  let selectedFields: (keyof localBrandSanitizers.SanitizedLocalBrand)[] | undefined;

  switch (mode) {
    case 'active':
      selectedFields = ['id', 'name', 'brandImage'];
      break;
    case 'all':
      selectedFields = ['id', 'name', 'brandImage', 'isActive'];
      break;
    case 'detailed':
      selectedFields = undefined; // return all fields
      break;
  }

  return {
    localBrands: localBrandSanitizers.allLocalBrandSanitizer(localBrands, selectedFields)
      .localBrands,
    total,
  };
};

/**
 * ----------------- Local Brand Selection Service -----------------
 *
 * @function selectLocalBrands
 * @description Updates selected brands and cascades the isActive status to their cylinders.
 *
 * Rules:
 * - Frontend sends only changed brands (optimized).
 * - Bulk updates both brands and cylinders.
 * - Uses lean + bulkWrite for performance.
 *
 * @param {localBrandValidator.LocalBrandSelectionInput} selectedBrands - Array of updated brand objects.
 * @param {string} userId - ID of the user performing the action.
 * @param {string} storeId - ID of the store.
 * @returns {Promise<{ brandUpdatedCount: number; cylinderUpdatedCount: number }>}
 */
export const selectLocalBrands = async (
  selectedBrands: localBrandValidator.LocalBrandSelectionInput,
  userId: string,
  storeId: string
): Promise<{ brandUpdatedCount: number; cylinderUpdatedCount: number }> => {
  if (!selectedBrands?.length) return { brandUpdatedCount: 0, cylinderUpdatedCount: 0 };

  // Bulk update brands
  const brandBulkOps = selectedBrands.map(({ id, isActive }) => ({
    updateOne: {
      filter: { _id: new Types.ObjectId(id), store: new Types.ObjectId(storeId) },
      update: {
        $set: {
          isActive,
          selectedBy: new Types.ObjectId(userId),
          updatedAt: new Date(),
        },
      },
    },
  }));

  const brandResult = await LocalBrand.bulkWrite(brandBulkOps);

  // Cascade updates to cylinders for same brand
  const cylinderBulkOps = selectedBrands.map(({ id, isActive }) => ({
    updateMany: {
      filter: { brand: new Types.ObjectId(id), store: new Types.ObjectId(storeId) },
      update: {
        $set: {
          isActive,
          updatedAt: new Date(),
          updatedBy: new Types.ObjectId(userId),
        },
      },
    },
  }));

  const cylinderResult = await Cylinder.bulkWrite(cylinderBulkOps);

  return {
    brandUpdatedCount: brandResult.modifiedCount,
    cylinderUpdatedCount: cylinderResult.modifiedCount,
  };
};

/**
 * ----------------- Default Exports (localBrandService) -----------------
 */
export default {
  getAllLocalBrands, // Get all local brands
  selectLocalBrands, // Select local brands
};
