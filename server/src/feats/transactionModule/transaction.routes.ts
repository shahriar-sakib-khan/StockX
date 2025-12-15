import { Router } from 'express';

import { transactionController } from './index.js';

import { assertAuth } from '@/common/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Transactions
 * description: Transaction management routes
 */

/**
 * @route   GET /transactions/meta
 * @desc    Get dynamic transaction categories & types (Backend-Driven UI)
 * @access  Authenticated
 */
router.get('/transactions/meta', assertAuth, transactionController.getTransactionMeta);

/**
 * @route   GET /stores/:storeId/transactions
 * @desc    Get all transactions for a specific store
 */
router.get('/transactions', transactionController.getAllTransactions);

export default router;
