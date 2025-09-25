import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';

import { storeValidator, storeScope, storeController } from './index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: User store management
 */

/**
 * ----------------- Store CRUD -----------------
 */

/**
 * @route   POST /stores
 * @desc    Create a new store for the authenticated user
 * @access  Authenticated
 */
router.post(
  '/stores',
  validateRequest(storeValidator.createStoreSchema),
  storeController.createStore
);

/**
 * @route   GET /stores
 * @desc    Get all stores belonging to the authenticated user
 * @access  Authenticated
 */
router.get('/stores', storeController.allStores);

/**
 * @route   GET /stores/:storeId
 * @desc    Get a single store by ID (owned by the user)
 * @access  Authenticated
 */
router.get('/stores/:storeId', storeScope(), storeController.singleStore);

/**
 * @route   PUT /stores/:storeId
 * @desc    Update store details
 * @access  Authenticated (store admin)
 */
router.put(
  '/stores/:storeId',
  storeScope(['admin']),
  validateRequest(storeValidator.updateStoreSchema),
  storeController.updateStore
);

/**
 * @route   DELETE /stores/:storeId
 * @desc    Delete a store
 * @access  Authenticated (store admin)
 */
router.delete('/stores/:storeId', storeScope(['admin']), storeController.deleteStore);

/**
 * ----------------- Store Profile -----------------
 */

/**
 * @route   GET /stores/:storeId/profile
 * @desc    Get current user’s profile within a specific store
 * @access  Authenticated
 */
router.get('/stores/:storeId/profile', storeScope(), storeController.myStoreProfile);

export default router;
