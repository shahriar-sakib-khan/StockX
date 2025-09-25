import { Router } from 'express';

import { transactionController } from './index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management routes
 */

/**
 * ----------------- Transaction Routes -----------------
 */

/**
 * @route   GET /stores/:storeId/transactions
 * @desc    Get all transactions for a specific store
 * @access  Private
 */
router.get('/transactions', transactionController.getAllTransactions);

export default router;
