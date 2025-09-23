import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';

import { storeValidator, storeScope, storeController } from './index.js';

import inviteRouter from '@/feats/inviteModule/invite.routes.js';
import localBrandRouter from '@/feats/brandModule/local.brand.routes.js';
import { cylinderRouter, cylinderTxRouter } from '../cylinderModule/index.js';

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
 * @route   POST /store
 * @desc    Create a new store for the authenticated user
 * @access  Authenticated
 */
router.post(
  '/store',
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
 * @route   GET /store/:storeId
 * @desc    Get a single store by ID (owned by the user)
 * @access  Authenticated
 */
router.get('/store/:storeId', storeScope(), storeController.singleStore);

/**
 * @route   PUT /store/:storeId
 * @desc    Update store details
 * @access  Authenticated (store admin)
 */
router.put(
  '/store/:storeId',
  storeScope(['admin']),
  validateRequest(storeValidator.updateStoreSchema),
  storeController.updateStore
);

/**
 * @route   DELETE /store/:storeId
 * @desc    Delete a store
 * @access  Authenticated (store admin)
 */
router.delete('/store/:storeId', storeScope(['admin']), storeController.deleteStore);

/**
 * ----------------- Store Profile -----------------
 */

/**
 * @route   GET /store/:storeId/profile
 * @desc    Get current user’s profile within a specific store
 * @access  Authenticated
 */
router.get('/store/:storeId/profile', storeScope(), storeController.myStoreProfile);

/**
 * ----------------- Sub-router (Store Invites) -----------------
 */
router.use('/store/:storeId', storeScope(), inviteRouter);

/**
 * ----------------- Sub-router (Local Brands) -----------------
 */
router.use('/store/:storeId', storeScope(), localBrandRouter);

/**
 * ----------------- Sub-router (Cylinder and Transactions) -----------------
 */
router.use('/store/:storeId', storeScope(), cylinderRouter);
router.use('/store/:storeId', storeScope(), cylinderTxRouter);

export default router;
