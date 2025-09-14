import { Types } from 'mongoose';

import { Cylinder, IGlobalBrand, LocalBrand } from '@/models/index.js';
import { generateSKU } from '@/common/index.js';

const seedLocalCylinders = async (
  userData: { brandId: string; activeStatus: boolean }[],
  workspaceId: string,
  divisionId: string,
  userId: string
): Promise<void> => {
  const brandIds = userData.map(b => b.brandId);
  if (brandIds.length === 0) {
    console.log('[Seed] No cylinders to seed.');
    return;
  }

  // fetch localBrands and their global brand info
  const localBrands = await LocalBrand.find({ _id: { $in: brandIds } })
    .select('globalBrand name image')
    .populate('globalBrand', 'name image sizes regulatorTypes')
    .lean();

  const bulkOps: any[] = [];
  const inactiveBrandIds: string[] = [];

  for (const brand of userData) {
    const localBrand = localBrands.find(b => b._id.toString() === brand.brandId);
    if (!localBrand || !localBrand.globalBrand) {
      console.log(`[Seed] Local brand ${brand.brandId} not found or missing globalBrand.`);
      continue;
    }

    if (brand.activeStatus) {
      const { sizes, regulatorTypes, name, image } =
        localBrand.globalBrand as unknown as IGlobalBrand;
      const fullStates = [true, false];

      for (const size of sizes) {
        for (const regulatorType of regulatorTypes) {
          for (const isFull of fullStates) {
            const sku = await generateSKU({ name, size, unit: 'L', regulatorType, workspaceId });

            bulkOps.push({
              updateOne: {
                filter: {
                  brand: localBrand._id,
                  size,
                  regulatorType,
                  isFull,
                  workspace: new Types.ObjectId(workspaceId),
                  division: new Types.ObjectId(divisionId),
                },
                update: {
                  $set: { isActive: brand.activeStatus },
                  $setOnInsert: {
                    name,
                    image,
                    sku,
                    unit: 'L',
                    count: 0,
                    createdBy: new Types.ObjectId(userId),
                  },
                },
                upsert: true,
              },
            });
          }
        }
      }
    } else {
      inactiveBrandIds.push(localBrand._id.toString());
    }
  }

  // deactivate in one go
  if (inactiveBrandIds.length > 0) {
    bulkOps.push({
      updateMany: {
        filter: {
          brand: { $in: inactiveBrandIds },
          division: new Types.ObjectId(divisionId),
          workspace: new Types.ObjectId(workspaceId),
        },
        update: { $set: { isActive: false } },
      },
    });
  }

  if (bulkOps.length > 0) {
    try {
      const res = await Cylinder.bulkWrite(bulkOps);
      console.log(
        `[Seed] Cylinders processed (${res}). Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}, Upserts: ${res.upsertedCount}`
      );
    } catch (err) {
      console.error('[Seed] BulkWrite error:', err);
    }
  } else {
    console.log('[Seed] No operations generated.');
  }
};

export default seedLocalCylinders;
