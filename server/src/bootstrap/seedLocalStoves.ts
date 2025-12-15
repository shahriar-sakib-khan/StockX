import { ClientSession, Types } from 'mongoose';

import { Stove } from '@/feats/productModule/index.js';
import { logger } from '@/utils';

/**
 * ----------------- Default Stoves List -----------------
 */
const defaultStoves = [
  {
    name: 'Single Burner Stove',
    stoveImage: 'singleStoveImageURL',
    burnerCount: 1,
    price: 900,
  },
  {
    name: 'Double Burner Stove',
    stoveImage: 'doubleStoveImageURL',
    burnerCount: 2,
    price: 1500,
  },
];

const seedLocalStoves = async (
  userId: string,
  storeId: string,
  session?: ClientSession
): Promise<void> => {
  // Count existing stoves in the store (using session)
  const count = await Stove.countDocuments({ store: storeId }).session(session || null);

  // If already seeded with the same count, skip re-seeding
  if (count === defaultStoves.length) {
    logger.info('[Seed] Stoves already seeded. Skipping stove seeding.');
    return;
  }

  // Prepare default stove data
  const stovesToInsert = defaultStoves.map(stove => ({
    ...stove,
    stockCount: 0,
    problemCount: 0,
    createdBy: new Types.ObjectId(userId),
    store: new Types.ObjectId(storeId),
  }));

  // Remove old stove data for this store (using session)
  await Stove.deleteMany({ store: storeId }, { session });

  // Insert new default stove data (using session)
  await Stove.insertMany(stovesToInsert, { session });

  logger.info(`[Seed] ✅ Seeded ${stovesToInsert.length} stoves for store ${storeId}.`);
};

export default seedLocalStoves;
