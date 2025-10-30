import { Types } from 'mongoose';

import { Stove } from '@/feats/stoveModule/index.js';

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

/**
 * @function seedLocalStoves
 * @description
 * Seeds the Stove collection with default stove entries for a given store.
 * Ensures that existing stove data for the store is replaced with clean defaults.
 *
 * @param {string} userId - The ID of the user creating the stoves.
 * @param {string} storeId - The ID of the store to seed stoves for.
 * @returns {Promise<void>} Resolves when seeding is complete.
 */
const seedLocalStoves = async (userId: string, storeId: string): Promise<void> => {
  // Count existing stoves in the store
  const count = await Stove.countDocuments({ store: storeId });

  // If already seeded with the same count, skip re-seeding
  if (count === defaultStoves.length) {
    console.log('[Seed] Stove collection already seeded.');
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

  // Remove old stove data for this store (keeps data clean)
  await Stove.deleteMany({ store: storeId });

  // Insert new default stove data
  await Stove.insertMany(stovesToInsert);

  console.log('[Seed] Inserted default Stoves.');
};

export default seedLocalStoves;
