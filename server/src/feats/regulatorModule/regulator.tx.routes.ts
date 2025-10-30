import { Router } from 'express';

import { regulatorTxController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: Regulator Transactions
 *   description: API endpoints for buying/selling regulators and marking defected ones
 */

const router = Router({ mergeParams: true });

/**
 * @route   POST /stores/:storeId/regulators/txs ?regulatorType=22&mode=buy|sell
 * @desc    Handle buying or selling regulators
 * @query   regulatorType - string (required)
 * @query   mode - string ('buy' | 'sell') (required)
 * @access  Authenticated
 */
router.post('/regulators/txs', regulatorTxController.handleRegulatorTransaction);

/**
 * @route   PATCH /stores/:storeId/regulators/mark ?regulatorType=22&doMark=true|false
 * @desc    Mark or unmark regulators as defected
 * @query   regulatorType - string (required)
 * @query   doMark - boolean (default: true)
 * @access  Authenticated
 */
router.patch('/regulators/mark', regulatorTxController.handleDefectedMarking);

export default router;
