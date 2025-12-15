import { Router } from 'express';

import { localBrandController } from './index.js';

import { storeScope } from '@/feats/storeModule/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: LocalBrand
 */

/**
 * @route   GET /stores/:storeId/brands
 * @desc    Get all local brands for a store (Active/All/Detailed modes)
 * @access  Public
 */
router.get('/brands', localBrandController.getAllLocalBrands);

/**
 * @route   PATCH /stores/:storeId/brands/select
 * @desc    Select/Deselect local brands for the store
 * @access  Private (Owner, Manager)
 */
router.patch(
  '/brands/select',
  storeScope(['owner', 'manager']),
  localBrandController.selectLocalBrands
);

/**
 * @route   PATCH /stores/:storeId/brands/:brandId
 * @desc    Update local brand details
 * @access  Private (Owner, Manager)
 */
router.patch(
  '/brands/:brandId',
  storeScope(['owner', 'manager']),
  localBrandController.updateLocalBrand
);

export default router;
