import { Types } from 'mongoose';
import { LocalBrand, Cylinder } from '@/models/index.js';

/**
 * @function seedLocalCylinders
 * @description
 * Force re-seeds all cylinders for a given store.
 * Deletes existing cylinders first if any exist.
 * Creates one cylinder per (size × regulatorType) combination.
 */
const seedLocalCylinders = async (userId: string, storeId: string): Promise<void> => {
  const storeObjectId = new Types.ObjectId(storeId);
  const userObjectId = new Types.ObjectId(userId);

  try {
    const localBrands = await LocalBrand.find({ store: storeObjectId })
      .select('id name sizes regulatorTypes prices cylinderImage cylinderImagePublicId')
      .lean();

    if (!localBrands.length) {
      console.log('[Seed:Cylinder] ⚠️ No local brands found. Skipping cylinder seeding.');
      return;
    }

    const existingCylinderCount = await Cylinder.countDocuments({ store: storeObjectId });
    if (existingCylinderCount > 0) {
      await Cylinder.deleteMany({ store: storeObjectId });
      console.log(`[Seed:Cylinder] 🧹 Deleted ${existingCylinderCount} existing cylinders.`);
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
            isActive: true,
            createdBy: userObjectId,
          });
        }
      }
    }

    if (!cylindersToInsert.length) {
      console.log('[Seed:Cylinder] ℹ️ No cylinder variants to insert.');
      return;
    }

    await Cylinder.insertMany(cylindersToInsert, { ordered: false });
    console.log(`[Seed:Cylinder] ✅ Seeded ${cylindersToInsert.length} cylinders successfully.`);
  } catch (err) {
    console.error('[Seed Error:Cylinder] ❌ Cylinder seeding failed:', err);
  }
};

export default seedLocalCylinders;
