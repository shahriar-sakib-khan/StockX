import { ClientSession, Types } from 'mongoose';

import { Regulator } from '@/feats/productModule/index.js';
import { logger } from '@/utils';

/**
 * ----------------- Default Brands List -----------------
 */
const defaultRegulators = [
  {
    name: '20mm Regulator',
    regulatorImage: 'regulatorImageURL',
    regulatorType: 20,
    price: 500,
  },
  {
    name: '22mm Regulator',
    regulatorImage: 'regulatorImageURL',
    regulatorType: 22,
    price: 600,
  },
];

const seedLocalRegulators = async (
  userId: string,
  storeId: string,
  session?: ClientSession
): Promise<void> => {
  const count = await Regulator.countDocuments({ store: storeId }).session(session || null);

  if (count === defaultRegulators.length) {
    logger.info('[Seed] Regulators already seeded. Skipping regulator seeding.');
    return;
  }

  const regulatorsToInsert = defaultRegulators.map(regulators => ({
    ...regulators,
    stockCount: 0,
    problemCount: 0,
    createdBy: new Types.ObjectId(userId),
    store: new Types.ObjectId(storeId),
  }));

  await Regulator.deleteMany({ store: storeId }, { session });
  await Regulator.insertMany(regulatorsToInsert, { session });

  logger.info(`[Seed] ✅ Seeded ${regulatorsToInsert.length} regulators for store ${storeId}.`);
};

export default seedLocalRegulators;
