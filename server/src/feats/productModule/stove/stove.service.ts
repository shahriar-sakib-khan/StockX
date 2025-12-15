import { Types, ClientSession } from 'mongoose';

import { Stove, IStove, stoveSanitizers } from './index.js';

import { Errors } from '@/error/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function getStoves
 * @description Fetches stoves for a store with pagination, mode-based detail level, and burner filtering.
 */
export const getStoves = async (
  storeId: string,
  page: number,
  limit: number,
  mode: 'all' | 'detailed' = 'all',
  burnerCount?: number
): Promise<stoveSanitizers.SanitizedStoves & { total: number }> => {
  const filter: any = { store: new Types.ObjectId(storeId) };

  if (burnerCount) {
    filter.burnerCount = burnerCount;
  }

  const total: number = await Stove.countDocuments(filter);
  if (total === 0) return { stoves: [], total };

  const skip: number = (page - 1) * limit;
  const stoves = await Stove.find(filter).skip(skip).limit(limit).lean();

  let selectedFields: (keyof stoveSanitizers.SanitizedStove)[] | undefined;

  // New Modes: 'all' (summary) vs 'detailed' (everything)
  switch (mode) {
    case 'all':
      selectedFields = ['id', 'name', 'burnerCount', 'price', 'stockCount', 'defectedCount'];
      break;
    case 'detailed':
      selectedFields = undefined; // Return all fields
      break;
  }

  return {
    stoves: stoveSanitizers.allStoveSanitizer(stoves as unknown as IStove[], selectedFields).stoves,
    total,
  };
};

/**
 * @function updatePrice
 * @description Updates the price of a single stove.
 */
export const updatePrice = async (
  id: string,
  price: number,
  storeId: string,
  userId: string,
  session?: ClientSession
) => {
  const stove = await Stove.findOneAndUpdate(
    { _id: id, store: storeId },
    {
      $set: {
        price,
        updatedBy: new Types.ObjectId(userId),
      },
    },
    { new: true, session }
  );

  if (!stove) throw new Errors.NotFoundError('Stove not found');

  logger.info(`Updated price: Stove ${stove._id} new price ${price} in store ${storeId}`);

  return stoveSanitizers.stoveSanitizer(stove);
};

export default {
  getStoves,
  updatePrice,
};
