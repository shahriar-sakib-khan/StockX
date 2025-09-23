import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest.js';

import { cylinderTxValidator, cylinderTxController } from './cylinder-tx/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Cylinder
 *   description: Cylinder transaction management
 */

/**
 * ----------------- Cylinder Transaction Routes -----------------
 */

/**
 * @route   POST /store/:storeId/cylinder/:cylinderId/buy
 * @desc    Purchase a cylinder from a store
 * @access  Authenticated
 */
router.post(
  '/cylinder/:cylinderId/buy',
  validateRequest(cylinderTxValidator.buyCylinderSchema),
  cylinderTxController.buyCylinder
);

/**
 * @route   POST /store/:storeId/cylinder/:cylinderId/sell
 * @desc    Sell a cylinder to a store
 * @access  Authenticated
 */
router.post(
  '/cylinder/:cylinderId/sell',
  validateRequest(cylinderTxValidator.sellCylinderSchema),
  cylinderTxController.sellCylinder
);

/**
 * @route   GET /cylinder/:cylinderId/txs
 * @desc    Get all transactions for a specific cylinder
 * @access  Authenticated
 */
router.get('/cylinder/:cylinderId/txs', cylinderTxController.allCylinderTransactions);

export default router;
