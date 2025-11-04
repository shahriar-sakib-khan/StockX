/**
 * @module ShopTxRoutes
 *
 * @description
 * Routes for handling shop-related transactions including due clearance,
 * transaction history, and cylinder exchanges.
 */

import { Router } from 'express';

import { shopTxController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: Shop Transactions
 *   description: Shop-level transaction operations (dues, exchanges, histories)
 */

const router = Router({ mergeParams: true });

/**
 * ----------------- Shop Transaction Routes -----------------
 */

/**
 * @route   POST /stores/:storeId/shops/:shopId/clear-due
 * @desc    Clear due for a specific shop
 * @access  Authenticated
 */
router.post('/shops/:shopId/clear-due', shopTxController.clearShopDue);

/**
 * @route   GET /stores/:storeId/shops/:shopId/txs
 * @desc    Get all transactions for a single shop (paginated)
 * @access  Authenticated
 */
router.get('/shops/:shopId/txs', shopTxController.singleShopTransactions);

/**
 * @route   GET /stores/:storeId/shops/txs
 * @desc    Get all shop-related transactions for a store (paginated)
 * @access  Authenticated
 */
router.get('/shops/txs', shopTxController.allShopTransactions);

/**
 * @route   POST /stores/:storeId/shops/exchange
 * @desc    Handle cylinder exchange (gas sale) transaction for shops
 * @access  Authenticated
 */
router.post('/shops/exchange', shopTxController.cylinderExchangeGasSell);

/**
 * ----------------- Export Router -----------------
 */
export default router;
