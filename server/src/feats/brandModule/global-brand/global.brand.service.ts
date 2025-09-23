import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';

import { GlobalBrand, globalBrandValidator, globalBrandSanitizers } from './index.js';

/**
 * @function createGlobalBrand
 * @description Creates a new global brand.
 *
 * @param {globalBrandValidator.CreateGlobalBrandInput} payload - Data for creating the global brand.
 * @param {string} userId - ID of the user creating the brand.
 * @returns {Promise<globalBrandSanitizers.SanitizedGlobalBrand>} The created global brand.
 */
export const createGlobalBrand = async (
  payload: globalBrandValidator.CreateGlobalBrandInput,
  userId: string
): Promise<globalBrandSanitizers.SanitizedGlobalBrand> => {
  const globalBrand = await GlobalBrand.create({
    ...payload,
    createdBy: new Types.ObjectId(userId),
  });

  return globalBrandSanitizers.globalBrandSanitizer(globalBrand);
};

/**
 * @function getAllGlobalBrands
 * @description Fetches all global brands with pagination.
 *
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<globalBrandSanitizers.SanitizedGlobalBrands & { total: number }>} Paginated global brands.
 */
export const getAllGlobalBrands = async (
  page: number,
  limit: number
): Promise<globalBrandSanitizers.SanitizedGlobalBrands & { total: number }> => {
  const total: number = await GlobalBrand.countDocuments();
  if (total === 0) return { globalBrands: [], total };

  const skip: number = (page - 1) * limit;
  const globalBrands = await GlobalBrand.find().skip(skip).limit(limit).lean();

  return {
    globalBrands: globalBrandSanitizers.allGlobalBrandSanitizer(globalBrands, [
      'name',
      'brandImage',
    ]).globalBrands,
    total,
  };
};

/**
 * @function getDetailedGlobalBrands
 * @description Fetches all detailed global brands with pagination.
 *
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<globalBrandSanitizers.SanitizedGlobalBrands & { total: number }>} Paginated detailed global brands.
 */
export const getDetailedGlobalBrands = async (
  page: number,
  limit: number
): Promise<globalBrandSanitizers.SanitizedGlobalBrands & { total: number }> => {
  const total: number = await GlobalBrand.countDocuments();
  if (total === 0) return { globalBrands: [], total };

  const skip: number = (page - 1) * limit;
  const globalBrands = await GlobalBrand.find()
    .populate('createdBy', 'name email') // Example populate for user info
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    globalBrands: globalBrandSanitizers.allGlobalBrandSanitizer(globalBrands).globalBrands,
    total,
  };
};

/**
 * @function getGlobalBrandById
 * @description Fetches a single global brand by ID.
 *
 * @param {string} brandId - The global brand ID.
 * @returns {Promise<globalBrandSanitizers.SanitizedGlobalBrand>} The requested global brand.
 * @throws {Errors.NotFoundError} If brand is not found.
 */
export const getGlobalBrandById = async (
  brandId: string
): Promise<globalBrandSanitizers.SanitizedGlobalBrand> => {
  const globalBrand = await GlobalBrand.findById(brandId).lean();

  if (!globalBrand) throw new Errors.NotFoundError('Global brand not found');

  return globalBrandSanitizers.globalBrandSanitizer(globalBrand);
};

/**
 * @function updateGlobalBrand
 * @description Updates a global brand by ID.
 *
 * @param {Record<string, any>} payload - Data to update the global brand.
 * @param {string} userId - ID of the user performing the update.
 * @param {string} brandId - The global brand ID.
 * @returns {Promise<globalBrandSanitizers.SanitizedGlobalBrand>} The updated global brand.
 * @throws {Errors.NotFoundError} If brand is not found.
 */
export const updateGlobalBrand = async (
  payload: globalBrandValidator.UpdateGlobalBrandInput,
  userId: string,
  brandId: string
): Promise<globalBrandSanitizers.SanitizedGlobalBrand> => {
  const { name, brandImage, cylinderImage, regulatorTypes, sizes, prices } = payload;

  const updatedBrand = await GlobalBrand.findByIdAndUpdate(
    brandId,
    {
      name,
      brandImage,
      cylinderImage,
      regulatorTypes,
      sizes,
      prices,
      updatedBy: new Types.ObjectId(userId),
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedBrand) throw new Errors.NotFoundError('Global brand not found');

  return globalBrandSanitizers.globalBrandSanitizer(updatedBrand);
};

/**
 * @function deleteGlobalBrand
 * @description Deletes a global brand by ID.
 *
 * @param {string} brandId - The global brand ID.
 * @returns {Promise<globalBrandSanitizers.SanitizedGlobalBrand>} The deleted global brand.
 * @throws {Errors.NotFoundError} If brand is not found.
 */
export const deleteGlobalBrand = async (
  brandId: string
): Promise<globalBrandSanitizers.SanitizedGlobalBrand> => {
  const deleted = await GlobalBrand.findByIdAndDelete(brandId);
  if (!deleted) throw new Errors.NotFoundError('Global brand not found');

  return globalBrandSanitizers.globalBrandSanitizer(deleted);
};

/**
 * ----------------- Default Exports (globalBrandService) -----------------
 */
export default {
  createGlobalBrand, // Create a new global brand
  getAllGlobalBrands, // Get all global brands with pagination
  getDetailedGlobalBrands, // Get all detailed global brands with pagination
  getGlobalBrandById, // Get a single global brand by ID
  updateGlobalBrand, // Update a global brand by ID
  deleteGlobalBrand, // Delete a global brand by ID
};
