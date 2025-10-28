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
 * @route   GET /stores/:storeId/cylinder-inventory ?size=12&regulatorType=22
 * @desc    Get active cylinders in a store, optionally filtered by size and regulator type
 * @query   size - number (default 12)
 * @query   regulatorType - number (default 22)
 * @access  Authenticated
 */
router.get('/cylinder/inventory', cylinderController.getCylinderInventory);

/**
 * ----------------- General Cylinder Routes -----------------
 */

/**
 * @route   GET /stores/:storeId/cylinders ?page=1&limit=20&mode=active|all|detailed
 * @desc    Get cylinders in a store with optional mode
 * @query   page (optional) - number (default: 1)
 * @query   limit (optional) - number (default: 20)
 * @query   mode - string ('active' | 'all' | 'detailed')
 * @access  Authenticated
 */
router.get('/cylinders', cylinderController.getAllCylinders);

export default router;
