import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';

import { shopValidator, shopController } from './shop/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Client shop management routes
 */

/**
 * ----------------- Shop CRUD Routes -----------------
 */

/**
 * @route   POST /stores/:storeId/shops
 * @desc    Create a new shop under a store
 * @access  Private
 */
router.post('/shops', validateRequest(shopValidator.createShopSchema), shopController.createShop);

/**
 * @route   GET /stores/:storeId/shops
 * @desc    Get all shops for a store
 * @access  Private
 */
router.get('/shops', shopController.getAllShops);

/**
 * @route   GET /stores/:storeId/shops/:shopId
 * @desc    Get a single shop by ID
 * @access  Private
 */
router.get('/shops/:shopId', shopController.getSingleShop);

/**
 * @route   PATCH /stores/:storeId/shops/:shopId
 * @desc    Update a shop's information
 * @access  Private
 */
router.patch(
  '/shops/:shopId',
  validateRequest(shopValidator.updateShopSchema),
  shopController.updateShop
);

/**
 * @route   DELETE /stores/:storeId/shops/:shopId
 * @desc    Delete a shop
 * @access  Private
 */
router.delete('/shops/:shopId', shopController.deleteShop);

export default router;
