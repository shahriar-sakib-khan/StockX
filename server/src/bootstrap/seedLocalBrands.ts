import { ClientSession, Types } from 'mongoose';

import { GlobalBrand, LocalBrand } from '@/models/index.js';
import { logger } from '@/utils';

/**
 * @function seedLocalBrands
 * @description
 * Force re-seeds all local brands for a given store by cloning from global brands.
 * Deletes existing local brands first if any exist.
 */
const seedLocalBrands = async (
  userId: string,
  storeId: string,
  session?: ClientSession
): Promise<void> => {
  const storeObjectId = new Types.ObjectId(storeId);
  const userObjectId = new Types.ObjectId(userId);

  try {
    // Read Global Brands
    const globalBrands = await GlobalBrand.find({}).lean();

    if (!globalBrands.length) {
      logger.info('[Seed:Brand] ⚠️ No global brands found. Skipping local brand seeding.');
      return;
    }

    const existingLocalCount = await LocalBrand.countDocuments({ store: storeObjectId }).session(
      session || null
    );

    if (existingLocalCount > 0) {
      await LocalBrand.deleteMany({ store: storeObjectId }, { session });
      logger.info(
        `[Seed:Brand] 🗑️ Deleted ${existingLocalCount} existing local brands for store ${storeId}.`
      );
    }

    const localBrandsToInsert = globalBrands.map(gb => ({
      globalBrand: gb._id,
      store: storeObjectId,

      name: gb.name,
      brandImage: gb.brandImage,
      brandImagePublicId: gb.brandImagePublicId,
      cylinderImage: gb.cylinderImage,
      cylinderImagePublicId: gb.cylinderImagePublicId,

      regulatorTypes: gb.regulatorTypes,
      sizes: gb.sizes,
      prices: gb.prices,

      totalFullCount: 0,
      totalEmptyCount: 0,

      isActive: false,
      createdBy: userObjectId,
      selectedBy: userObjectId,
    }));

    await LocalBrand.insertMany(localBrandsToInsert, { session, ordered: false });
    logger.info(
      `[Seed:Brand] ✅ Seeded ${localBrandsToInsert.length} local brands for store ${storeId}.`
    );
  } catch (err) {
    logger.error(`[Seed:Brand] ❌ Error seeding local brands for store ${storeId}: ${err}`);
    throw err;
  }
};

export default seedLocalBrands;
