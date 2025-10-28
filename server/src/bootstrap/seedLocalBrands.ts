import { Types } from 'mongoose';
import { GlobalBrand, LocalBrand } from '@/models/index.js';

/**
 * @function seedLocalBrands
 * @description
 * Force re-seeds all local brands for a given store by cloning from global brands.
 * Deletes existing local brands first if any exist.
 */
const seedLocalBrands = async (userId: string, storeId: string): Promise<void> => {
  const storeObjectId = new Types.ObjectId(storeId);
  const userObjectId = new Types.ObjectId(userId);

  try {
    const globalBrands = await GlobalBrand.find({}).lean();

    if (!globalBrands.length) {
      console.log('[Seed:Brand] ⚠️ No global brands found. Please seed GlobalBrand first.');
      return;
    }

    const existingLocalCount = await LocalBrand.countDocuments({ store: storeObjectId });
    if (existingLocalCount > 0) {
      await LocalBrand.deleteMany({ store: storeObjectId });
      console.log(`[Seed:Brand] 🧹 Deleted ${existingLocalCount} existing local brands.`);
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

    await LocalBrand.insertMany(localBrandsToInsert, { ordered: false });
    console.log(
      `[Seed:Brand] ✅ Seeded ${localBrandsToInsert.length} local brands for store: ${storeId}`
    );
  } catch (err) {
    console.error('[Seed Error:Brand] ❌ Local brand seeding failed:', err);
  }
};

export default seedLocalBrands;
