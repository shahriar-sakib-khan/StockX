import { Types } from 'mongoose';

import { Regulator } from '@/feats/regulatorModule/index.js';

/**
 * ----------------- Default Brands List -----------------
 */
const defaultRegulators = [
  {
    name: '20mm Regulator',
    regulatorImage: 'regulatorImageURL',
    regulatorType: '20mm',
    price: 500,
  },
  {
    name: '22mm Regulator',
    regulatorImage: 'regulatorImageURL',
    regulatorType: '22mm',
    price: 600,
  },
];

/**
 * @function seedLocalRegulators
 * @description
 * Seeds the Regulator collection with default regulators.
 * @param {string} userId - The ID of the user who created the store.
 * @param {string} storeId - The ID of the store to seed the regulators for.
 * @returns {Promise<void>} A promise that resolves when the regulators are seeded.
 */
const seedLocalRegulators = async (userId: string, storeId: string): Promise<void> => {
  const count = await Regulator.countDocuments({ store: storeId });
  if (count === defaultRegulators.length) {
    console.log('[Seed] Regulator collection already seeded.');
    return;
  }

  const regulatorsToInsert = defaultRegulators.map(regulators => ({
    ...regulators,
    stockCount: 0,
    problemCount: 0,
    createdBy: new Types.ObjectId(userId),
    store: new Types.ObjectId(storeId),
  }));

  await Regulator.deleteMany({ store: storeId });
  await Regulator.insertMany(regulatorsToInsert);

  console.log('[Seed] Inserted default Regulators.');
};

export default seedLocalRegulators;
