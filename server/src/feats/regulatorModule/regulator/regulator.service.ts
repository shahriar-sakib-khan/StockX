import { Types } from 'mongoose';

import Regulator from './regulator.model.js';
import { regulatorSanitizers } from './index.js';

/**
 * ----------------- Regulator Inventory -----------------
 */

/**
 */
export const getRegulatorInventory = async (storeId: string): Promise<any> => {
  const regulatorInventoryData = await Regulator.find({ store: new Types.ObjectId(storeId) }).sort({
    createdAt: -1,
  });

  return regulatorSanitizers.allRegulatorSanitizer(regulatorInventoryData, [
    'id',
    'name',
    'regulatorImage',
    'regulatorType',
    'price',
    'stockCount',
    'problemCount',
  ]).regulators;
};

/**
 * ----------------- Default Exports (cylinderService) -----------------
 */
export default {
  getRegulatorInventory, // Get paginated list of active cylinders for a store
};
