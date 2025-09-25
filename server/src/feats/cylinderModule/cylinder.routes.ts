import { Router } from 'express';

import { cylinderController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: Cylinder
 *   description: Cylinder inventory management
 */

const router = Router({ mergeParams: true });

/**
 * ----------------- Cylinder Inventory Routes -----------------
 */

/**
 * @route   GET /stores/:storeId/cylinders
 * @desc    Get active cylinders in a store
 * @access  Authenticated
 */
router.get('/cylinders', cylinderController.getActiveCylinders);

/**
 * @route   GET /stores/:storeId/cylinders/a
 * @desc    Get all cylinders in a store
 * @access  Authenticated
 */
router.get('/cylinders/a', cylinderController.allCylinders);

/**
 * @route   GET /stores/:storeId/cylinders/d
 * @desc    Get detailed cylinder list for a store
 * @access  Authenticated
 */
router.get('/cylinders/d', cylinderController.detailedCylinders);

export default router;
