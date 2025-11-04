import { Router } from 'express';
import { stoveController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: Stove
 *   description: Stove inventory management
 */

const router = Router({ mergeParams: true });

/**
 * ----------------- Stove Inventory Routes -----------------
 */

/**
 * @route   GET /stores/:storeId/stoves/inventory
 * @desc    Get active stoves in a store
 * @access  Authenticated
 */
router.get('/stoves/inventory', stoveController.getStoveInventory);

/**
 * ----------------- General Stove Routes -----------------
 */

/**
 * @route   GET /stores/:storeId/stoves?page=1&limit=20&mode=active|all|detailed
 * @desc    Get stoves in a store with optional mode
 * @access  Authenticated
 */
router.get('/stoves', stoveController.getAllStoves);

/**
 * @route   PATCH /stores/:storeId/stoves/price
 * @desc    Update price of a stove
 * @body    id - Stove ID (required)
 * @body    price - New price (required)
 * @access  Authenticated
 */
router.patch('/stoves/price', stoveController.updateStovePrice);

export default router;
