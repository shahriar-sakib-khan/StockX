import { Router } from 'express';

import { storeController } from '@/controllers/v1';
import { divisionScope, validateRequest } from '@/middlewares';
import { store } from '@/validations';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   - name: Store
 *     description: Manage stores under a division within a workspace
 */

/**
 * ----------------- Store CRUD -----------------
 */

/**
 * @route   POST /:workspaceId/divisions/:divisionId/stores
 * @desc    Create a new store in a division
 * @access  Admin (division)
 */
router.post(
  '/',
  divisionScope(['division_admin']),
  validateRequest(store.storeInputSchema),
  storeController.createStore
);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/stores
 * @desc    Get all stores in a division
 * @access  Authenticated (division)
 */
router.get('/', storeController.getStores);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/stores/:storeId
 * @desc    Get a single store by ID
 * @access  Authenticated (division)
 */
router.get('/:storeId', storeController.getSingleStore);

/**
 * @route   PUT /:workspaceId/divisions/:divisionId/stores/:storeId
 * @desc    Update a store
 * @access  Admin (division)
 */
router.put(
  '/:storeId',
  divisionScope(['division_admin']),
  validateRequest(store.updateStoreSchema),
  storeController.updateStore
);

/**
 * @route   DELETE /:workspaceId/divisions/:divisionId/stores/:storeId
 * @desc    Delete a store
 * @access  Admin (division)
 */
router.delete('/:storeId', divisionScope(['division_admin']), storeController.deleteStore);

export default router;
