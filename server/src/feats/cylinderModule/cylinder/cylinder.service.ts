import { Types } from 'mongoose';

import { Cylinder, cylinderSanitizers } from './index.js';

/**
 * ----------------- Cylinder Inventory Service -----------------
 *
 * Rules:
 * - Skip cylinders whose LocalBrand is inactive.
 * - Full count = sum of `count` for cylinders where `isFull = true`.
 * - Empty count = sum of `count` for cylinders where `isFull = false`.
 * - Group by brand.
 */
/**
 * @function getCylinderInventory
 * @description Get cylinder inventory for a store, optionally filtered by size and regulator type.
 * @param {string} storeId - The ID of the store.
 * @param {number} size - The size of the cylinder.
 * @param {string} regulatorType - The type of the regulator.
 * @returns {Promise<any>} A promise that resolves to an array of cylinder inventory.
 */
export const getCylinderInventory = async (
  storeId: string,
  size: number,
  regulatorType: string
): Promise<any> => {
  const match: any = { store: new Types.ObjectId(storeId) };

  // Filters
  if (size && size !== 0) match.size = size;
  if (regulatorType && regulatorType.trim() !== '') match.regulatorType = regulatorType;

  const summary = await Cylinder.aggregate([
    // Base filter
    { $match: match },

    // Lookup brand details (to access isActive)
    {
      $lookup: {
        from: 'localbrands',
        localField: 'brand',
        foreignField: '_id',
        as: 'brandData',
      },
    },
    { $unwind: '$brandData' },

    // Skip inactive brands
    {
      $match: {
        'brandData.isActive': true,
      },
    },

    // Group by brand
    {
      $group: {
        _id: '$brand',
        brandName: { $first: '$brandData.name' },
        cylinderImage: { $first: '$brandData.cylinderImage' },
        fullCount: {
          $sum: {
            $cond: [{ $eq: ['$isFull', true] }, '$count', 0],
          },
        },
        emptyCount: {
          $sum: {
            $cond: [{ $eq: ['$isFull', false] }, '$count', 0],
          },
        },
        problemCount: {
          $sum: {
            $cond: [{ $eq: ['$isDefected', true] }, '$count', 0],
          },
        },
      },
    },

    // Add extra fields (if needed for frontend display)
    {
      $addFields: {
        id: '$_id',
      },
    },

    // Final projection
    {
      $project: {
        _id: 0,
        id: 1,
        brandName: 1,
        cylinderImage: 1,
        fullCount: 1,
        emptyCount: 1,
        problemCount: 1,
      },
    },
  ]);

  return summary;
};

/**
 * ----------------- General Cylinder Services -----------------
 */

/**
 * @function getActiveCylinders
 * Fetches active cylinders for a store with pagination.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<cylinderSanitizers.SanitizedCylinders & { total: number }>} Paginated active cylinders.
 */
export const getAllActiveCylinders = async (
  storeId: string,
  page: number,
  limit: number
): Promise<cylinderSanitizers.SanitizedCylinders & { total: number }> => {
  const total: number = await Cylinder.countDocuments({
    store: new Types.ObjectId(storeId),
    isActive: true,
  });
  if (total === 0) return { cylinders: [], total };

  const skip: number = (page - 1) * limit;
  const cylinders = await Cylinder.find({ store: storeId, isActive: true })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    cylinders: cylinderSanitizers.allCylinderSanitizer(cylinders, [
      'id',
      'sku',
      'name',
      'price',
      'count',
    ]).cylinders,
    total,
  };
};

/**
 * @function getAllCylinders
 * Fetches all cylinders for a store with pagination.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<cylinderSanitizers.SanitizedCylinders & { total: number }>} Paginated cylinders.
 */
export const getAllCylinders = async (
  storeId: string,
  page: number,
  limit: number
): Promise<cylinderSanitizers.SanitizedCylinders & { total: number }> => {
  const total: number = await Cylinder.countDocuments({ store: new Types.ObjectId(storeId) });
  if (total === 0) return { cylinders: [], total };

  const skip: number = (page - 1) * limit;
  const cylinders = await Cylinder.find({ store: storeId }).skip(skip).limit(limit).lean();

  return {
    cylinders: cylinderSanitizers.allCylinderSanitizer(cylinders, [
      'id',
      'sku',
      'name',
      'price',
      'count',
      'isActive',
    ]).cylinders,
    total,
  };
};

/**
 * @function detailedCylinders
 * Fetches detailed cylinder information for a store with pagination.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<cylinderSanitizers.SanitizedCylinders & { total: number }>} Paginated detailed cylinders.
 */
export const detailedCylinders = async (
  storeId: string,
  page: number,
  limit: number
): Promise<cylinderSanitizers.SanitizedCylinders & { total: number }> => {
  const total: number = await Cylinder.countDocuments({ store: new Types.ObjectId(storeId) });
  if (total === 0) return { cylinders: [], total };

  const skip: number = (page - 1) * limit;
  const cylinders = await Cylinder.find({ store: storeId }).skip(skip).limit(limit).lean();

  return {
    cylinders: cylinderSanitizers.allCylinderSanitizer(cylinders).cylinders,
    total,
  };
};

/**
 * ----------------- Default Exports (cylinderService) -----------------
 */
export default {
  getCylinderInventory,
  getAllActiveCylinders, // Get paginated list of active cylinders for a store
  getAllCylinders, // Get paginated list of cylinders for a store
  detailedCylinders, // Get paginated detailed cylinder data for a store
};
