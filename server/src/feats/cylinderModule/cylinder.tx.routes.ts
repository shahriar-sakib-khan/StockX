import { Router } from 'express';

import { cylinderTxController } from './index.js';

/**
 * @swagger
 * tags:
 * name: Cylinder Transaction
 * description: Manage cylinder buy, sell, defected, and exchange transactions
 */

const router = Router({ mergeParams: true });

/**
 * ----------------- Cylinder Transaction Routes -----------------
 */

/**
 * @route   POST /stores/:storeId/cylinders/buy
 * @desc    Record a purchase transaction for cylinders (buy from supplier or add to stock)
 * @access  Authenticated
 */
router.post('/cylinders/buy', cylinderTxController.buyCylinders);

/**
 * @route   POST /stores/:storeId/cylinders/sell
 * @desc    Record a sale transaction for cylinders (sell to customers)
 * @access  Authenticated
 */
router.post('/cylinders/sell', cylinderTxController.sellCylinder);

/**
 * @route   POST /stores/:storeId/cylinders/defected
 * @desc    Mark cylinders as defected and update inventory
 * @access  Authenticated
 */
router.post('/cylinders/defected', cylinderTxController.markDefected);

/**
 * @route   POST /stores/:storeId/cylinders/undefected
 * @desc    Mark cylinders as defected and update inventory
 * @access  Authenticated
 */
router.post('/cylinders/undefected', cylinderTxController.unmarkDefected);

/**
 * ----------------- Cylinder Exchange Routes -----------------
 */

/**
 * @route   POST /stores/:storeId/cylinders/exchange/full-for-empty
 * @desc    Exchange empty cylinders for full ones (gas pricing applies)
 * @access  Authenticated
 */
router.post('/cylinders/exchange/full-for-empty', cylinderTxController.exchangeFullForEmpty);

/**
 * @route   POST /stores/:storeId/cylinders/exchange/empty-for-empty
 * @desc    Exchange empty cylinders between stores (inter-store swap)
 * @access  Authenticated
 */
router.post('/cylinders/exchange/empty-for-empty', cylinderTxController.exchangeEmptyForEmpty);

export default router;
