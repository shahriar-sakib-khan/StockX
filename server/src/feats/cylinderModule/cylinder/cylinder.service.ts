import { Types } from 'mongoose';

import { Cylinder, cylinderSanitizers } from './index.js';
import { Errors } from '@/error/index.js';

/**
 * ----------------- Cylinder Inventory Service -----------------
 *
 * Rules:
 * - Skip cylinders that are inactive.
 * - Use fullCount, emptyCount, and defectedCount directly from each cylinder.
 * - Grouped by brand.
 */
/**
 * @function getCylinderInventory
 * @description Get cylinder inventory for a store, optionally filtered by size and regulator type.
 * @param {string} storeId - The ID of the store.
 * @param {number} size - The size of the cylinder.
 * @param {number} regulatorType - The type of the regulator.
 * @returns {Promise<any>} A promise that resolves to an array of cylinder inventory.
 */
export const getCylinderInventory = async (
  storeId: string,
  size: number,
  regulatorType: number
): Promise<cylinderSanitizers.SanitizedCylinders> => {
  if (!size) throw new Errors.BadRequestError('Size is required');
  if (!regulatorType) throw new Errors.BadRequestError('Regulator type is required');

  const cylinders = await Cylinder.find({
    store: new Types.ObjectId(storeId),
    size,
    regulatorType,
    isActive: true,
  })
    .select('id sku brandName cylinderImage price fullCount emptyCount defectedCount')
    .lean();

  return {
    cylinders: cylinderSanitizers.allCylinderSanitizer(cylinders, [
      'id',
      'sku',
      'brandName',
      'cylinderImage',
      'price',
      'fullCount',
      'emptyCount',
      'defectedCount',
    ]).cylinders,
  };
};

/**
 * ----------------- General Cylinder Services -----------------
 */

/**
 * ----------------- Unified Cylinder Fetch Service -----------------
 *
 * Combines getAllActiveCylinders, getAllCylinders, and detailedCylinders into a single function.
 *
 * @function getAllCylinders
 * @description Fetches cylinders for a store with pagination and mode-based detail level.
 *
 * Modes:
 * - 'active'   → Only active cylinders.
 * - 'all'      → All cylinders (active + inactive).
 * - 'detailed' → All cylinders with full detailed data.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @param {'active' | 'all' | 'detailed'} mode - Mode of retrieval.
 * @returns {Promise<cylinderSanitizers.SanitizedCylinders & { total: number }>} Paginated cylinder data.
 */
export const getAllCylinders = async (
  storeId: string,
  page: number,
  limit: number,
  mode: 'active' | 'all' | 'detailed' = 'all'
): Promise<cylinderSanitizers.SanitizedCylinders & { total: number }> => {
  const filter: any = { store: new Types.ObjectId(storeId) };
  if (mode === 'active') filter.isActive = true;

  const total: number = await Cylinder.countDocuments(filter);
  if (total === 0) return { cylinders: [], total };

  const skip: number = (page - 1) * limit;

  const cylinders = await Cylinder.find(filter).skip(skip).limit(limit).lean();

  // Field selection based on mode
  let selectedFields: (keyof cylinderSanitizers.SanitizedCylinder)[] | undefined;

  switch (mode) {
    case 'active':
      selectedFields = [
        'id',
        'sku',
        'brandName',
        'price',
        'fullCount',
        'emptyCount',
        'defectedCount',
      ];
      break;

    case 'all':
      selectedFields = [
        'id',
        'sku',
        'brandName',
        'cylinderImage',
        'price',
        'fullCount',
        'emptyCount',
        'defectedCount',
        'isActive',
      ];
      break;

    case 'detailed':
      selectedFields = undefined; // return all fields
      break;
  }

  return {
    cylinders: cylinderSanitizers.allCylinderSanitizer(cylinders, selectedFields).cylinders,
    total,
  };
};

/**
 * ----------------- Default Exports (cylinderService) -----------------
 */
export default {
  getCylinderInventory, // Get active cylinders in a store

  getAllCylinders, // Get cylinders for a store
};
