import { Router } from 'express';

import { cylinderController, cylinderValidator } from './cylinder/index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Cylinder
 * description: Cylinder Inventory Management
 */

/**
 * @route   GET /stores/:storeId/cylinders
 * @desc    Get cylinder inventory with modes
 */
router.get(
  '/cylinders',
  storeScope(['owner', 'manager', 'staff']),
  validateRequest(cylinderValidator.getCylindersQuerySchema),
  cylinderController.getInventory
);

/**
 * @route   PATCH /stores/:storeId/cylinders/prices
 * @desc    Bulk update prices
 */
router.patch(
  '/cylinders/prices',
  storeScope(['owner', 'manager']),
  validateRequest(cylinderValidator.bulkPriceUpdateSchema),
  cylinderController.bulkUpdatePrices
);

/**
 * @route   PATCH /stores/:storeId/cylinders/selection
 * @desc    Bulk Select/Unselect brands
 */
router.patch(
  '/cylinders/selection',
  storeScope(['owner']),
  validateRequest(cylinderValidator.selectLocalBrandsSchema),
  cylinderController.selectLocalBrands
);

export default router;
