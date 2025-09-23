import { Types } from 'mongoose';

import { Cylinder, cylinderSanitizers } from './index.js';

/**
 * @function getActiveCylinders
 * Fetches active cylinders for a store with pagination.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<cylinderSanitizers.SanitizedCylinders & { total: number }>} Paginated active cylinders.
 */
export const getActiveCylinders = async (
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
  getActiveCylinders, // Get paginated list of active cylinders for a store
  getAllCylinders, // Get paginated list of cylinders for a store
  detailedCylinders, // Get paginated detailed cylinder data for a store
};
