import { Router } from 'express';

import { procurementController, procurementValidator } from './procurement/index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Procurement (Manufacturer)
 */

/**
 * @route   POST /stores/:storeId/procurement/package
 * @desc    Buy New Package (Cylinders + Gas)
 */
router.post(
  '/package',
  storeScope(['owner', 'manager']),
  validateRequest(procurementValidator.purchasePackageSchema),
  procurementController.purchasePackage
);

/**
 * @route   POST /stores/:storeId/procurement/refill
 * @desc    Refill Gas (Exchange Empties -> Get Fulls)
 */
router.post(
  '/refill',
  storeScope(['owner', 'manager']),
  validateRequest(procurementValidator.purchaseRefillSchema),
  procurementController.purchaseRefill
);

/**
 * @route   POST /stores/:storeId/procurement/product
 * @desc    Buy Products (Stoves/Regulators)
 */
router.post(
  '/product',
  storeScope(['owner', 'manager']),
  validateRequest(procurementValidator.purchaseProductSchema),
  procurementController.purchaseProduct
);

/**
 * @route   POST /stores/:storeId/procurement/defected
 * @desc    Exchange Defected Cylinders (Defected -> Full)
 */
router.post(
  '/defected',
  storeScope(['owner', 'manager']),
  validateRequest(procurementValidator.purchaseDefectedSchema),
  procurementController.exchangeDefected
);

export default router;
