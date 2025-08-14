import { Types } from 'mongoose';

import { Cylinder, IGlobalBrand, LocalBrand } from '@/models';
import { cylinderSanitizers } from '@/utils';
import { generateSKU } from '@/common';

/**
 * @function seedLocalCylinders
 * @description Seed cylinders for the given local brands and user.
 *
 * @param { { brandId: string; activeStatus: boolean }[]} userData - An array of objects containing the brandId and activeStatus properties.
 * @param {string} workspaceId - The ID of the workspace to retrieve divisions for.
 * @param {string} divisionId - The ID of the division to retrieve divisions for.
 * @param {string} userId - The ID of the user to retrieve divisions for.
 * @returns {Promise<void>}
 */
export const seedLocalCylinders = async (
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
                workspace: workspaceId,
              },
              update: {
                $setOnInsert: {
                  name,
                  sku,
                  unit: 'L',
                  count: 0,
                  division: divisionId,
                  createdBy: userId,
                },
              },
              upsert: true,
            },
          });
        }
      }
    }
  }

  if (bulkOps.length > 0) {
    const res = await Cylinder.bulkWrite(bulkOps);
    console.log(
      `Cylinders seeded/updated successfully. Matched: ${res.matchedCount}, Upserted: ${res.upsertedCount}`
    );
  }
};

/**
 * @function getCylinders
 * @description Get cylinders for the given workspace and division.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of items to retrieve per page.
 * @param {string} workspaceId - The ID of the workspace to retrieve divisions for.
 * @param {string} divisionId - The ID of the division to retrieve divisions for.
 * @returns {Promise<SanitizedAllCylinders & { total: number }>}
 */
export const getCylinders = async (
  page: number,
  limit: number,
  workspaceId: string,
  divisionId: string
): Promise<cylinderSanitizers.SanitizedAllCylinders & { total: number }> => {
  const total: number = await Cylinder.countDocuments({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  });

  if (total === 0) return { cylinders: [], total };

  const cylinders = await Cylinder.find({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('workspace', 'name')
    .populate('division', 'name')
    .lean();

  return { cylinders: cylinderSanitizers.allCylinderSanitizer(cylinders).cylinders, total };
};

export const changeCylinderCount = async (
  cylinder: any,
  cylinderId: string,
  userId: string
): Promise<any> => {};

export default {
  getCylinders,
  seedLocalCylinders,
  
  changeCylinderCount,
};
