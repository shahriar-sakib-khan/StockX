import { Types } from 'mongoose';

import { GlobalBrand, LocalBrand } from '@/models';
import { brandSanitizers } from '@/utils';

// <============================> Global Brand Services <============================>
/**
 * @function getGlobalBrands
 * @description Get global brands for the given division.
 *
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of divisions to retrieve per page.
 * @returns {Promise<SanitizedAllGlobalBrands & { total: number }>} An array of local brand documents.
 */
export const getGlobalBrands = async (
  page: number,
  limit: number
): Promise<brandSanitizers.SanitizedAllGlobalBrands & { total: number }> => {
  const total: number = await GlobalBrand.countDocuments({});
  if (total === 0) return { globalBrands: [], total };

  const skip: number = (page - 1) * limit;
  const globalBrands = await GlobalBrand.find({}).skip(skip).limit(limit).lean();

  return {
    globalBrands: brandSanitizers.allGlobalBrandSanitizer(globalBrands, ['id', 'name'])
      .globalBrands,
    total,
  };
};

/**
 * @function getDetailedGlobalBrands
 * @description Get global brands with all the details.
 *
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of divisions to retrieve per page.
 * @returns {Promise<{ globalBrands: SanitizedGlobalBrand[]; total: number }>} An array of local brand documents.
 */
export const getDetailedGlobalBrands = async (
  page: number,
  limit: number
): Promise<{ globalBrands: brandSanitizers.SanitizedGlobalBrand[]; total: number }> => {
  const total: number = await GlobalBrand.countDocuments({});
  if (total === 0) return { globalBrands: [], total };

  const skip: number = (page - 1) * limit;
  const globalBrands = await GlobalBrand.find({}).skip(skip).limit(limit).lean();
  const sanitizedGlobalBrands = globalBrands.map(brand =>
    brandSanitizers.globalBrandSanitizer(brand)
  );

  return {
    globalBrands: sanitizedGlobalBrands,
    total,
  };
};

export const addGlobalBrand = async () => {};

export const updateGlobalBrand = async () => {};

export const deleteGlobalBrand = async () => {};

// <============================> Local Brand Services <============================>

/**
 * @function getAllLocalBrands
 */
export const getAllLocalBrands = async (
  page: number,
  limit: number,
  workspaceId: string,
  divisionId: string
): Promise<brandSanitizers.SanitizedAllLocalBrands & { total: number }> => {
  const total: number = await LocalBrand.countDocuments({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  });

  if (total === 0) return { localBrands: [], total };

  const localBrands = await LocalBrand.find({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('_id name image isActive')
    .lean();

  return {
    localBrands: brandSanitizers.allLocalBrandSanitizer(localBrands, [
      'id',
      'name',
      'image',
      'isActive',
    ]).localBrands,
    total,
  };
};

/**
 * @function getLocalBrands
 * @description Get all local brands for the given workspace, division, and user.
 *
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of divisions to retrieve per page.
 * @param {string} workspaceId - The ID of the workspace to retrieve divisions for.
 * @param {string} divisionId - The ID of the division to retrieve divisions for.
 * @returns {Promise<{ localBrands: any[]; total: number }>} An array of local brand documents.
 */
export const getActiveLocalBrands = async (
  page: number,
  limit: number,
  workspaceId: string,
  divisionId: string
): Promise<brandSanitizers.SanitizedAllLocalBrands & { total: number }> => {
  const total: number = await LocalBrand.countDocuments({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
    isActive: true,
  });

  if (total === 0) return { localBrands: [], total };

  const localBrands = await LocalBrand.find({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
    isActive: true,
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('_id name image')
    .lean();

  return {
    localBrands: brandSanitizers.allLocalBrandSanitizer(localBrands, ['id', 'name', 'image'])
      .localBrands,
    total,
  };
};

export const detailedLocalBrands = async (
  page: number,
  limit: number,
  workspaceId: string,
  divisionId: string
): Promise<brandSanitizers.SanitizedAllLocalBrands & { total: number }> => {
  const total: number = await LocalBrand.countDocuments({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  });

  if (total === 0) return { localBrands: [], total };

  const localBrands = await LocalBrand.find({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('globalBrand')
    .populate('workspace')
    .populate('division')
    .lean();

  const sanitizedLocalBrands = localBrands.map(brand => brandSanitizers.localBrandSanitizer(brand));

  return { localBrands: sanitizedLocalBrands, total };
};

export const selectLocalBrands = async (
  userData: { id: string; isActive: boolean }[],
  userId: string
): Promise<any> => {
  const operations = userData.map(brand => ({
    updateOne: {
      filter: { _id: new Types.ObjectId(brand.id) },
      update: {
        $set: {
          isActive: brand.isActive,
          selectedBy: userId,
        },
      },
    },
  }));

  const result = await LocalBrand.bulkWrite(operations);

  return result;
};

export default {
  getGlobalBrands,
  addGlobalBrand,
  updateGlobalBrand,
  deleteGlobalBrand,
  getDetailedGlobalBrands,

  getAllLocalBrands,
  getActiveLocalBrands,
  detailedLocalBrands,
  selectLocalBrands,
};
