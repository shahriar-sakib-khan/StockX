import { Types } from 'mongoose';

import { Cylinder, IGlobalBrand, LocalBrand } from '@/models';
import { generateSKU } from '@/common';

const seedLocalCylinders = async (
  userData: { brandId: string; activeStatus: boolean }[],
  workspaceId: string,
  divisionId: string,
  userId: string
): Promise<void> => {
  // filter active brands
  const activeBrands = userData.filter(b => b.activeStatus).map(b => b.brandId);
  if (activeBrands.length === 0) return;

  // fetch global brand info
  const activeLocalBrands = await LocalBrand.find({ _id: { $in: activeBrands } })
    .select('globalBrand')
    .populate('globalBrand', 'name sizes regulatorTypes')
    .lean();

  const bulkOps: any[] = [];

  for (const localBrand of activeLocalBrands) {
    const { sizes, regulatorTypes, name } = localBrand.globalBrand as unknown as IGlobalBrand;
    const fullStates = [true, false]; // true = Full, false = Empty

    for (const size of sizes) {
      for (const regulatorType of regulatorTypes) {
        for (const isFull of fullStates) {
          const sku = await generateSKU({ name, size, unit: 'L', regulatorType, workspaceId });

          // prepare bulk operation with upsert to avoid duplicates
          bulkOps.push({
            updateOne: {
              filter: {
                brand: localBrand._id,
                size,
                regulatorType,
                isFull,
                workspace: new Types.ObjectId(workspaceId),
              },
              update: {
                $setOnInsert: {
                  name,
                  sku,
                  unit: 'L',
                  count: 0,
                  division: new Types.ObjectId(divisionId),
                  createdBy: new Types.ObjectId(userId),
                },
              },
              upsert: true,
            },
          });
        }
      }
    }
  }

  const count = Math.max(bulkOps.length, 0);
  if (count === 0) {
    console.log('[Seed] Local Cylinders collection already seeded.');
    return;
  }

  const res = await Cylinder.bulkWrite(bulkOps);
  console.log(
    `[Seed] Seeded/updated default cylinders successfully. Matched: ${res.matchedCount}, Upserted: ${res.upsertedCount}`
  );
};

export default seedLocalCylinders;
