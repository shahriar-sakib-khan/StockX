import { Router } from 'express';

import { cylinderController, cylinderValidator } from '@/feats/cylinderModule/index.js';
import { regulatorController, regulatorValidator } from '@/feats/productModule/regulator/index.js';
import { stoveController, stoveValidator } from '@/feats/productModule/stove/index.js';
import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Inventory
 * description: Centralized Inventory Fetching
 */

// ----------------- CYLINDERS -----------------

/**
 * @route   GET /stores/:storeId/inventory/cylinders
 * @desc    Get cylinder inventory with filtering modes
 */
router.get(
  '/inventory/cylinders',
  storeScope(['owner', 'admin', 'manager', 'staff']),
  validateRequest(cylinderValidator.getCylindersQuerySchema),
  cylinderController.getInventory
);

// ----------------- STOVES -----------------

/**
 * @route   GET /stores/:storeId/inventory/stoves
 * @desc    Get stove inventory with filtering modes
 */
router.get(
  '/inventory/stoves',
  storeScope(['owner', 'admin', 'manager', 'staff']),
  validateRequest(stoveValidator.getStovesQuerySchema),
  stoveController.getStoves
);

// ----------------- REGULATORS -----------------

/**
 * @route   GET /stores/:storeId/inventory/regulators
 * @desc    Get regulator inventory with filtering modes
 */
router.get(
  '/inventory/regulators',
  storeScope(['owner', 'admin', 'manager', 'staff']),
  validateRequest(regulatorValidator.getRegulatorsQuerySchema),
  regulatorController.getRegulators
);

export default router;
