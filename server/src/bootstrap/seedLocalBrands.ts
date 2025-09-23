import { Types } from 'mongoose';

import { GlobalBrand, LocalBrand } from '@/models/index.js';

/**
 * @function seedLocalBrands
 * @description Seed local brands for a store from global brands.
 *
 * @param {string} userId - The ID of the user who created the store.
 * @param {string} storeId - The ID of the store being seeded.
 */
const seedLocalBrands = async (userId: string, storeId: string): Promise<void> => {
  const globalBrands = await GlobalBrand.find({}).lean();

  const localBrands = globalBrands.map(globalBrand => ({
    globalBrand: globalBrand._id,
    store: new Types.ObjectId(storeId),
    name: globalBrand.name,
    brandImage: globalBrand.brandImage,
    cylinderImage: globalBrand.cylinderImage,
    regulatorTypes: globalBrand.regulatorTypes,
    sizes: globalBrand.sizes,
    prices: globalBrand.prices,

    isActive: false,
    totalFullCount: 0,
    totalEmptyCount: 0,
    selectedBy: new Types.ObjectId(userId),
  }));

  await LocalBrand.insertMany(localBrands);

  console.log('[Seed] Local brands seeded successfully');
};

export default seedLocalBrands;
