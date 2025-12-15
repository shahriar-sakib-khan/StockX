import { Router } from 'express';

import { regulatorController, regulatorValidator } from './regulator/index.js';
import { stoveController, stoveValidator } from './stove/index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Products
 * description: Management of Stoves and Regulators
 */

// ----------------- STOVES -----------------

/**
 * @route   GET /stores/:storeId/products/stoves
 */
router.get(
  '/products/stoves',
  storeScope(['owner', 'admin', 'manager', 'staff']),
  validateRequest(stoveValidator.getStovesQuerySchema),
  stoveController.getStoves
);

/**
 * @route   PATCH /stores/:storeId/products/stoves/:stoveId/price
 */
router.patch(
  '/products/stoves/:stoveId/price',
  storeScope(['owner', 'manager']),
  validateRequest(stoveValidator.updatePriceSchema),
  stoveController.updatePrice
);

// ----------------- REGULATORS -----------------

/**
 * @route   GET /stores/:storeId/products/regulators
 */
router.get(
  '/products/regulators',
  storeScope(['owner', 'admin', 'manager', 'staff']),
  validateRequest(regulatorValidator.getRegulatorsQuerySchema),
  regulatorController.getRegulators
);

/**
 * @route   PATCH /stores/:storeId/products/regulators/:regulatorId/price
 */
router.patch(
  '/products/regulators/:regulatorId/price',
  storeScope(['owner', 'manager']),
  validateRequest(regulatorValidator.updatePriceSchema),
  regulatorController.updatePrice
);

export default router;
