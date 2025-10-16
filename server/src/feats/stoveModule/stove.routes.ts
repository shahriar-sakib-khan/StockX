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
 * @route   GET /stores/:storeId/stove-inventory
 * @access  Authenticated
 */
router.get('/stove-inventory', stoveController.getStoveInventory);

export default router;
