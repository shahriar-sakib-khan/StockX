import { ClientSession, Types, AnyBulkWriteOperation } from 'mongoose';

import { Cylinder, cylinderSanitizers, ICylinder } from './index.js';

import { Errors } from '@/error/index.js';

/**
 * @function getCylindersByMode
 * @description Flexible fetching for inventory screens with specific projections and criteria.
 */
export const getCylindersByMode = async (
  storeId: string,
  mode: 'all' | 'active' | 'all-detailed' | 'active-detailed' = 'active',
  size: number = 12,
  regulatorType: number = 22
) => {
  const filter: any = {
    store: new Types.ObjectId(storeId),
    size: size,
    regulatorType: regulatorType,
  };

  // 1. Filter Logic
  if (mode.startsWith('active')) {
    filter.isActive = true;
  }

  // 2. Projection Logic
  let projection = '';
  if (!mode.includes('detailed')) {
    projection = 'brandName size color price fullCount emptyCount defectedCount isActive';
  }

  const cylinders = await Cylinder.find(filter).select(projection).lean();

  return cylinderSanitizers.allCylinderSanitizer(cylinders as unknown as ICylinder[]).cylinders;
};

/**
 * @function bulkUpdatePrices
 * @description Updates prices for multiple cylinder documents within a store.
 */
export const bulkUpdatePrices = async (
  storeId: string,
  updates: { cylinderId: string; price: number }[],
  session?: ClientSession
) => {
  if (updates.length === 0) return;

  const ops: AnyBulkWriteOperation<ICylinder>[] = updates.map(u => ({
    updateOne: {
      filter: {
        _id: new Types.ObjectId(u.cylinderId),
        store: new Types.ObjectId(storeId),
      },
      update: { $set: { price: u.price } },
    },
  }));

  await Cylinder.bulkWrite(ops, { session });

  // Return updated active list for UI consistency (using defaults)
  return getCylindersByMode(storeId, 'active');
};

/**
 * @function selectLocalBrands
 * @description Bulk Select/Unselect brands (Local Copy) for the store.
 */
export const selectLocalBrands = async (
  storeId: string,
  selections: { cylinderId: string; isActive: boolean }[],
  session?: ClientSession
) => {
  if (selections.length === 0) return;

  const ops: AnyBulkWriteOperation<ICylinder>[] = selections.map(s => ({
    updateOne: {
      filter: {
        _id: new Types.ObjectId(s.cylinderId),
        store: new Types.ObjectId(storeId),
      },
      update: { $set: { isActive: s.isActive } },
    },
  }));

  await Cylinder.bulkWrite(ops, { session });

  // Return all to let user see what is enabled/disabled
  return getCylindersByMode(storeId, 'all');
};

/**
 * @function updatePrice
 * @description Update the selling price of a single cylinder.
 */
export const updatePrice = async (
  id: string,
  price: number,
  storeId: string,
  session?: ClientSession
) => {
  const cylinder = await Cylinder.findOneAndUpdate(
    { _id: id, store: storeId },
    { $set: { price } },
    { new: true, session }
  );
  if (!cylinder) throw new Errors.NotFoundError('Cylinder not found');
  return cylinderSanitizers.cylinderSanitizer(cylinder);
};

/**
 * @function removeAllCylinders
 * @description Deletes all cylinders for a specific store.
 */
export const removeAllCylinders = async (storeId: string, session?: ClientSession) => {
  await Cylinder.deleteMany({ store: storeId }, { session });
};

export default {
  getCylindersByMode,
  bulkUpdatePrices,
  selectLocalBrands,
  updatePrice,
  removeAllCylinders,
};
