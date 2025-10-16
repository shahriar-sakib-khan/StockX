import { Types } from 'mongoose';

import { LocalBrand, Cylinder } from '@/models/index.js';
import { generateSKU } from '@/common/index.js';

/**
 * @function seedLocalCylinders
 * @description
 * Seeds cylinders for a store when it's first created.
 *
 * For each local brand, generates cylinders for:
 * - each size × regulator type × [full, empty]
 *
 * Runs inside a transaction to ensure atomicity.
 * @param {string} userId
 * @param {string} storeId
 */
export const seedLocalCylinders = async (userId: string, storeId: string): Promise<void> => {
  const storeObjectId = new Types.ObjectId(storeId);
  const userObjectId = new Types.ObjectId(userId);

  // Fetch local brands for the store
  const localBrands = await LocalBrand.find({ store: storeObjectId })
    .select('id name cylinderImage regulatorTypes sizes prices')
    .lean();

  if (localBrands.length === 0) {
    console.log('[Seed] No local brands found for this store.');
    return;
  }

  const cylindersToSeed = [];
  const fullStates = [true, false];
  const unit = 'L';

  for (const localBrand of localBrands) {
    const { _id, name, cylinderImage, regulatorTypes, sizes, prices } = localBrand;

    // Pre-map prices for O(1) lookups
    const priceMap = new Map();
    if (prices) {
      for (const p of prices) {
        priceMap.set(`${p.size}-${p.regulatorType}`, p.price);
      }
    }

    for (const size of sizes) {
      for (const regulatorType of regulatorTypes) {
        for (const isFull of fullStates) {
          const sku = await generateSKU({
            name,
            size,
            unit,
            regulatorType,
            storeId: storeObjectId,
          });

          cylindersToSeed.push({
            store: storeObjectId,
            brand: _id,
            sku,
            name,
            cylinderImage,
            regulatorType,
            size,
            unit,
            price: priceMap.get(`${size}-${regulatorType}`) || 0,
            count: 0,
            isFull,
            isActive: false,
            createdBy: userObjectId,
          });
        }
      }
    }
  }

  if (cylindersToSeed.length === 0) {
    console.log('[Seed] No cylinders generated.');
    return;
  }

  const result = await Cylinder.insertMany(cylindersToSeed);
  console.log(
    `[Seed] ${cylindersToSeed.length} cylinders seeded successfully. ${result.length !== cylindersToSeed.length ? `Failed: ${cylindersToSeed.length - result.length}` : ''}`
  );

  return;
};

export default seedLocalCylinders;
