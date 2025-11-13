import { Router } from 'express';

import { exchangeController } from './exchange/index.js';

/**
 * @swagger
 * tags:
 *   name: Exchange
 *   description: Cylinder exchange module
 */

const router = Router({ mergeParams: true });

/**
 * @route   POST /stores/:storeId/exchange
 * @desc    Create a cylinder exchange record
 */
router.post('/exchange', exchangeController.createExchange);

// /**
//  * @route   GET /stores/:storeId/exchange
//  * @desc    Get paginated exchanges for a store
//  */
// router.get('/exchange', exchangeController.getAllExchanges);

// /**
//  * @route   GET /stores/:storeId/exchange/:id
//  * @desc    Get details of a single exchange
//  */
// router.get('/exchange/:id', exchangeController.getExchangeById);

export default router;
