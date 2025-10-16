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
 * @route   GET /stores/:storeId/regulator-inventory
 * @access  Authenticated
 */
router.get('/regulator-inventory', regulatorController.getRegulatorInventory);

export default router;
