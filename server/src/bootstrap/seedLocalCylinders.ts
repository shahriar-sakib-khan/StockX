import { ClientSession, Types } from 'mongoose';

import { LocalBrand, Cylinder } from '@/models/index.js';
import { logger } from '@/utils';

/**
 * @function seedLocalCylinders
 * @description
 * Force re-seeds all cylinders for a given store.
 * Deletes existing cylinders first if any exist.
 * Creates one cylinder per (size × regulatorType) combination.
 */
const seedLocalCylinders = async (
  userId: string,
  storeId: string,
  session?: ClientSession
): Promise<void> => {
  const storeObjectId = new Types.ObjectId(storeId);
  const userObjectId = new Types.ObjectId(userId);

  try {
    // Must use session to see brands created in the previous step of this transaction
    const localBrands = await LocalBrand.find({ store: storeObjectId })
      .select('id name sizes regulatorTypes prices cylinderImage cylinderImagePublicId')
      .session(session || null)
      .lean();

    if (!localBrands.length) {
      logger.info('[Seed:Cylinder] ⚠️ No local brands found. Skipping cylinder seeding.');
      return;
    }

    const existingCylinderCount = await Cylinder.countDocuments({ store: storeObjectId }).session(
      session || null
    );

    if (existingCylinderCount > 0) {
      await Cylinder.deleteMany({ store: storeObjectId }, { session });
      logger.info(
        `[Seed:Cylinder] 🗑️ Deleted ${existingCylinderCount} existing cylinders for store ${storeId}.`
      );
    }

    const cylindersToInsert: any[] = [];
    const unit = 'KG';

    for (const brand of localBrands) {
      for (const size of brand.sizes) {
        for (const regulatorType of brand.regulatorTypes) {
          const variantPrice =
            brand.prices?.find(p => p.size === size && p.regulatorType === regulatorType)?.price ??
            0;

          cylindersToInsert.push({
            store: storeObjectId,
            brand: brand._id,
            sku: `${brand.name}-${size}-${regulatorType}`.toLowerCase(),
            brandName: brand.name,

            cylinderImage: brand.cylinderImage,
            cylinderImagePublicId: brand.cylinderImagePublicId ?? null,

            size,
            regulatorType,
            unit,
            price: variantPrice,

            fullCount: 0,
            emptyCount: 0,
            defectedCount: 0,
            isActive: false,
            createdBy: userObjectId,
          });
        }
      }
    }

    if (!cylindersToInsert.length) {
      logger.info('[Seed:Cylinder] ⚠️ No cylinders to insert after processing brands. Skipping.');
      return;
    }

    await Cylinder.insertMany(cylindersToInsert, { session, ordered: false });
    logger.info(
      `[Seed:Cylinder] ✅ Seeded ${cylindersToInsert.length} cylinders for store ${storeId}.`
    );
  } catch (err) {
    logger.error(`[Seed:Cylinder] ❌ Error seeding local cylinders for store ${storeId}: ${err}`);
    throw err;
  }
};

export default seedLocalCylinders;
