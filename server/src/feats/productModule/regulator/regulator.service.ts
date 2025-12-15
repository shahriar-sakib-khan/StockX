import { Types, ClientSession } from 'mongoose';

import { Regulator, IRegulator, regulatorSanitizers } from './index.js';

import { Errors } from '@/error/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function getRegulators
 * @description Fetches regulators for a store with pagination, mode-based detail level, and type filtering.
 */
export const getRegulators = async (
  storeId: string,
  page: number,
  limit: number,
  mode: 'all' | 'detailed' = 'all',
  regulatorType?: number
): Promise<regulatorSanitizers.SanitizedRegulators & { total: number }> => {
  const filter: any = { store: new Types.ObjectId(storeId) };

  if (regulatorType) {
    filter.regulatorType = regulatorType;
  }

  const total: number = await Regulator.countDocuments(filter);
  if (total === 0) return { regulators: [], total };

  const skip: number = (page - 1) * limit;
  const regulators = await Regulator.find(filter).skip(skip).limit(limit).lean();

  let selectedFields: (keyof regulatorSanitizers.SanitizedRegulator)[] | undefined;

  switch (mode) {
    case 'all':
      selectedFields = ['id', 'name', 'regulatorType', 'price', 'stockCount', 'defectedCount'];
      break;
    case 'detailed':
      selectedFields = undefined; // Return all fields
      break;
  }

  return {
    regulators: regulatorSanitizers.allRegulatorSanitizer(
      regulators as unknown as IRegulator[],
      selectedFields
    ).regulators,
    total,
  };
};

/**
 * @function updatePrice
 * @description Updates the price of a single regulator.
 */
export const updatePrice = async (
  id: string,
  price: number,
  storeId: string,
  userId: string,
  session?: ClientSession
) => {
  const regulator = await Regulator.findOneAndUpdate(
    { _id: id, store: storeId },
    {
      $set: {
        price,
        updatedBy: new Types.ObjectId(userId),
      },
    },
    { new: true, session }
  );

  if (!regulator) throw new Errors.NotFoundError('Regulator not found');

  logger.info(`Updated price: Regulator ${regulator._id} new price ${price} in store ${storeId}`);

  return regulatorSanitizers.regulatorSanitizer(regulator);
};

export default {
  getRegulators,
  updatePrice,
};
