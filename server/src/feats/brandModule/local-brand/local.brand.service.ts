import { Types, ClientSession } from 'mongoose';

import { LocalBrand, ILocalBrand, localBrandSanitizers, localBrandValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { Cylinder } from '@/feats/cylinderModule/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function getAllLocalBrands
 * @description Fetches all local brands for a specific store with pagination and filtering.
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
    localBrands: localBrandSanitizers.allLocalBrandSanitizer(
      localBrands as unknown as ILocalBrand[],
      selectedFields
    ).localBrands,
    total,
  };
};

/**
 * @function selectLocalBrands
 * @description Updates selected brands and cascades the isActive status to their cylinders.
 */
export const selectLocalBrands = async (
  selectedBrands: localBrandValidator.LocalBrandSelectionInput,
  userId: string,
  storeId: string,
  session?: ClientSession
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

  const brandResult = await LocalBrand.bulkWrite(brandBulkOps, { session });

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

  const cylinderResult = await Cylinder.bulkWrite(cylinderBulkOps, { session });

  return {
    brandUpdatedCount: brandResult.modifiedCount,
    cylinderUpdatedCount: cylinderResult.modifiedCount,
  };
};

/**
 * @function updateLocalBrand
 * @description Allows Store Owner to edit alias name or images of their local brand copy.
 */
export const updateLocalBrand = async (
  brandId: string,
  data: { name?: string; brandImage?: string; cylinderImage?: string },
  storeId: string,
  userId: string,
  session?: ClientSession
) => {
  const brand = await LocalBrand.findOneAndUpdate(
    { _id: brandId, store: storeId },
    {
      $set: {
        ...data,
        updatedBy: new Types.ObjectId(userId),
        updatedAt: new Date(),
      },
    },
    { new: true, session }
  ).lean();

  if (!brand) throw new Errors.NotFoundError('Local Brand not found');

  // Cascade update to Cylinder snapshot data if name/image changed
  if (data.name || data.cylinderImage) {
    const updateData: any = {};
    if (data.name) updateData.brandName = data.name;
    if (data.cylinderImage) updateData.cylinderImage = data.cylinderImage;

    await Cylinder.updateMany(
      { brand: brand._id, store: storeId },
      { $set: updateData },
      { session }
    );
  }

  logger.info(`Local Brand updated: ${brand.name} (${brand._id}) by ${userId}`);
  return localBrandSanitizers.localBrandSanitizer(brand as unknown as ILocalBrand);
};

/**
 * @function removeAllLocalBrands
 * @description Deletes all local brands for a specific store (Cascading Delete).
 */
export const removeAllLocalBrands = async (
  storeId: string,
  session?: ClientSession
): Promise<void> => {
  const result = await LocalBrand.deleteMany({ store: storeId }, { session });
  logger.info(`[Cleanup] Deleted ${result.deletedCount} local brands for store ${storeId}`);
};

export default {
  getAllLocalBrands,
  selectLocalBrands,
  updateLocalBrand,
  removeAllLocalBrands,
};
