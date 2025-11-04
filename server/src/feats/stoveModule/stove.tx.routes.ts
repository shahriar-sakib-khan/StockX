import { Router } from 'express';
import { stoveTxController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: Stove Transactions
 *   description: API endpoints for buying/selling stoves and marking defected ones
 */

const router = Router({ mergeParams: true });

/**
 * @route   POST /stores/:storeId/stoves/txs ?burnerCount=2&mode=buy|sell
 * @desc    Handle buying or selling stoves
 * @query   burnerCount - number (required)
 * @query   mode - string ('buy' | 'sell') (required)
 * @access  Authenticated
 */
router.post('/stoves/txs', stoveTxController.handleStoveTransaction);

/**
 * @route   PATCH /stores/:storeId/stoves/mark ?burnerCount=2&doMark=true|false
 * @desc    Mark or unmark stoves as defected
 * @query   burnerCount - number (required)
 * @query   doMark - boolean (default: true)
 * @access  Authenticated
 */
router.patch('/stoves/mark', stoveTxController.handleDefectedMarking);

export default router;
