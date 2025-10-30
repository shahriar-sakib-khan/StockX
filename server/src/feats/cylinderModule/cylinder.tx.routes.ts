import { Router } from 'express';

import { cylinderTxController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: CylinderTx
 *   description: Cylinder transaction and exchange management
 */

const router = Router({ mergeParams: true });

/**
 * ----------------- Cylinder Transaction Routes -----------------
 */

/**
 * @route   POST /stores/:storeId/cylinders/txs ?size=12&regulatorType=22&mode=buy|sell
 * @desc    Handle buying or selling cylinders
 * @query   size - number (required)
 * @query   regulatorType - number (required)
 * @query   mode - string ('buy' | 'sell') (required)
 * @access  Authenticated
 */
router.post('/cylinders/txs', cylinderTxController.handleCylinderTransaction);

/**
 * @route   PATCH /stores/:storeId/cylinders/mark ?size=12&regulatorType=22&doMark=true|false
 * @desc    Mark or unmark cylinders as defected
 * @query   size - number (required)
 * @query   regulatorType - number (required)
 * @query   doMark - boolean (default: true)
 * @access  Authenticated
 */
router.patch('/cylinders/mark', cylinderTxController.handleDefectedMarking);

/**
 * ----------------- Cylinder Exchange Routes -----------------
 */

/**
 * @route   POST /stores/:storeId/cylinders/txs/gas
 * @desc    Exchange full cylinders for empty ones
 * @access  Authenticated
 */
router.post('/cylinders/txs/gas', cylinderTxController.exchangeFullForEmpty);

/**
 * @route   POST /stores/:storeId/cylinders/txs/swap
 * @desc    Exchange empty cylinders between stores
 * @access  Authenticated
 */
router.post('/cylinders/txs/swap', cylinderTxController.exchangeEmptyForEmpty);

/**
 * ----------------- Cylinder Transaction Retrieval -----------------
 */

/**
 * @route   GET /stores/:storeId/cylinders/txs ?page=1&limit=20
 * @desc    Get all cylinder txs (paginated)
 * @query   page (optional) - number (default: 1)
 * @query   limit (optional) - number (default: 20)
 * @access  Authenticated
 */
router.get('/cylinders/txs', cylinderTxController.allCylinderTransactions);

export default router;
