import { Types } from 'mongoose';

import { Cylinder, cylinderSanitizers } from './index.js';
import { Errors } from '@/error/index.js';

/** ----------------- Cylinder Inventory Service ----------------- */

/**
 * @function getCylinderInventory
 * @description Get cylinder inventory for a store, optionally filtered by size and regulator type.
 * rules:
 * - Frontend sends only changed brands (optimized).
 * - Bulk updates both brands and cylinders.
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

/** ----------------- General Cylinder Services ----------------- */

/**
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
 * @function updateCylinderPrice
 * @description Bulk update price of cylinders in a store filtered by size and regulator type.
 *
 * @param {string} storeId - The ID of the store.
 * @param {number} size - Cylinder size to filter by.
 * @param {number} regulatorType - Regulator type to filter by.
 * @param {number} price - New price to set.
 * @returns {Promise<{ modifiedCount: number }>} Number of updated cylinders.
 */
export const updateCylinderPrice = async (
  userData: any,
  size: number,
  regulatorType: number,
  storeId: string,
  userId: string
): Promise<cylinderSanitizers.SanitizedCylinder> => {
  const { id, price } = userData;

  const cylinder = await Cylinder.findById(id).select('id sku size regulatorType store price');

  if (!cylinder) throw new Errors.NotFoundError('Cylinder not found.');
  if (
    cylinder.size !== size ||
    cylinder.regulatorType !== regulatorType ||
    cylinder.store.toString() !== storeId
  )
    throw new Errors.BadRequestError('Invalid cylinder.');

  cylinder.price = price;
  cylinder.updatedBy = new Types.ObjectId(userId);

  await cylinder.save();

  return cylinderSanitizers.cylinderSanitizer(cylinder);
};

/**
 * ----------------- Default Exports (cylinderService) -----------------
 */
export default {
  getCylinderInventory, // Get active cylinders in a store

  getAllCylinders, // Get cylinders for a store
  updateCylinderPrice, // Update price of cylinders
};
