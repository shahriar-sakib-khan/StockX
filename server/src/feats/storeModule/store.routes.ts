import { Router } from 'express';

import { storeController, storeValidator, storeScope } from './store/index.js';

import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Store
 * description: Store management
 */

/**
 * @route   GET /stores
 * @desc    Get all stores for current user
 */
router.get('/stores', storeController.allStores);

/**
 * @route   POST /stores
 * @desc    Create a new store
 */
router.post(
  '/stores',
  validateRequest(storeValidator.createStoreSchema),
  storeController.createStore
);

/**
 * @route   GET /stores/:storeId
 * @desc    Get a single store
 */
router.get('/stores/:storeId', storeScope([]), storeController.singleStore);

/**
 * @route   PATCH /stores/:storeId
 * @desc    Update a store
 */
router.patch(
  '/stores/:storeId',
  storeScope(['owner']),
  validateRequest(storeValidator.updateStoreSchema),
  storeController.updateStore
);

/**
 * @route   DELETE /stores/:storeId
 * @desc    Delete a store
 */
router.delete('/stores/:storeId', storeScope(['owner']), storeController.deleteStore);

export default router;
