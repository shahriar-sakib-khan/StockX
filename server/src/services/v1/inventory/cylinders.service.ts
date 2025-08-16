import { Types } from 'mongoose';

import { Cylinder } from '@/models';
import { cylinderSanitizers } from '@/utils';

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

export default {
  getCylinders,
};
