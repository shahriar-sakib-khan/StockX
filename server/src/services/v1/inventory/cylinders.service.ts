import { Types } from 'mongoose';

import { Cylinder } from '@/models/index.js';
import { cylinderSanitizers } from '@/sanitizers/index.js';

/**
 * @function getAllCylinders
 * @description Get cylinders for the given workspace and division.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of items to retrieve per page.
 * @param {string} workspaceId - The ID of the workspace to retrieve divisions for.
 * @param {string} divisionId - The ID of the division to retrieve divisions for.
 * @returns {Promise<SanitizedAllCylinders & { total: number }>}
 */
export const getAllCylinders = async (
  page: number,
  limit: number,
  workspaceId: string,
  divisionId: string
): Promise<cylinderSanitizers.SanitizedAllCylinders & { total: number }> => {
  const total: number = await Cylinder.countDocuments({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  });

  const cylinders = await Cylinder.aggregate([
    {
      $lookup: {
        from: 'localbrands', // collection name in MongoDB
        localField: 'brand',
        foreignField: '_id',
        as: 'brandInfo',
      },
    },
    { $unwind: '$brandInfo' },
    {
      $match: {
        division: new Types.ObjectId(divisionId),
        'brandInfo.isActive': true,
      },
    },
    {
      $project: {
        _id: 1,
        workspace: 1,
        division: 1,
        name: 1,
        image: 1,
        sku: 1,
        regulatorType: 1,
        size: 1,
        unit: 1,
        isFull: 1,
        count: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
        brand: {
          _id: '$brandInfo._id',
          name: '$brandInfo.name',
          image: '$brandInfo.image',
          globalBrand: '$brandInfo.globalBrand',
        },
      },
    },
  ]);

  console.log('cylinders', cylinders);

  // total count across all matched cylinders
  const totalCount = cylinders.reduce((sum, cyl) => sum + (cyl.count || 0), 0);

  return {
    cylinders: cylinderSanitizers.allCylinderSanitizer(cylinders, ['id', 'name']).cylinders,
    total: totalCount,
  };
};

export default {
  getAllCylinders,
};
