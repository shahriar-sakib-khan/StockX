import { Router } from 'express';

import { transactionController } from '@/controllers/v1';
import { validateRequest } from '@/middlewares';
import { transaction } from '@/validations';

const router = Router({ mergeParams: true });

// <============================> General Transaction Routes <============================>

/**
 * @route   GET /:workspaceId/divisions/:divisionId/transactions
 * @desc    Get all transactions in a division
 * @access  Authenticated
 */
router.get('/', transactionController.allTransactions);

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
