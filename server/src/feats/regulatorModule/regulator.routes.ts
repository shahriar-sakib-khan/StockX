import { Router } from 'express';
import { regulatorController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: Regulator
 *   description: Regulator inventory management
 */

const router = Router({ mergeParams: true });

/**
 * ----------------- Regulator Inventory Routes -----------------
 */

/**
 * @route   GET /stores/:storeId/regulators/inventory
 * @desc    Get active regulators in a store
 * @access  Authenticated
 */
router.get('/regulators/inventory', regulatorController.getRegulatorInventory);

/**
 * ----------------- General Regulator Routes -----------------
 */

/**
 * @route   GET /stores/:storeId/regulators?page=1&limit=20&mode=active|all|detailed
 * @desc    Get regulators in a store with optional mode
 * @access  Authenticated
 */
router.get('/regulators', regulatorController.getAllRegulators);

/**
 * @route   PATCH /stores/:storeId/regulators/price
 * @desc    Update price of a regulator
 * @body    id - Regulator ID (required)
 * @body    price - New price (required)
 * @access  Authenticated
 */
router.patch('/regulators/price', regulatorController.updateRegulatorPrice);

export default router;
