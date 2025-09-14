import { Router } from 'express';

import { transactionController } from '@/controllers/v1/index.js';
import { validateRequest } from '@/middlewares/index.js';
import { transaction } from '@/validations/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Transaction management within workspace divisions
 */

/**
 * ----------------- General Transaction Routes -----------------
 */

/**
 * @route   GET /:workspaceId/divisions/:divisionId/transactions
 * @desc    Get all transactions in a division
 * @access  Authenticated
 */
router.get('/', transactionController.allTransactions);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/transactions/:transactionId
 * @desc    Get a single transaction in a division
 * @access  Authenticated
 */
router.get('/:transactionId', transactionController.singleTransaction);

/**
 * ----------------- Transaction Category Routes -----------------
 */

/**
 * @route   GET /:workspaceId/divisions/:divisionId/transactions/categories
 * @desc    Get all transaction categories in a division
 * @access  Authenticated
 */
router.get('/categories', transactionController.allTxCategories);

// <============================> Cylinder Transaction Routes <============================>
/**
 * @route   GET /:workspaceId/divisions/:divisionId/transactions/buy-cylinders
 * @desc    Get all transactions in a division
 * @access  Authenticated
 */
router.get(
  '/buy-cylinders',
  validateRequest(transaction.transactionSchema),
  transactionController.buyCylinders
);

export default router;
