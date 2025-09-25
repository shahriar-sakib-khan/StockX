import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';
import { localBrandController, localBrandValidator } from './index.js';

/**
 * @swagger
 * tags:
 *   name: Local Brands
 *   description: Local brand management routes
 */

const router = Router({ mergeParams: true });

/**
 * ----------------- Local Brand CRUD -----------------
 */

/**
 * @route   GET /stores/:storeId/brands
 * @desc    Get all active local brands
 * @access  Private
 */
router.get('/brands', localBrandController.activeLocalBrands);

/**
 * @route   GET /stores/:storeId/brands/a
 * @desc    Get all local brands
 * @access  Private
 */
router.get('/brands/a', localBrandController.allLocalBrands);

/**
 * @route   GET /stores/:storeId/brands/d
 * @desc    Get detailed local brand list
 * @access  Private
 */
router.get('/brands/d', localBrandController.detailedLocalBrands);

/**
 * @route   PATCH /stores/:storeId/brands
 * @desc    Select local brands
 * @access  Private
 */
router.patch(
  '/brands',
  validateRequest(localBrandValidator.localBrandSelectionSchema),
  localBrandController.selectBrands
);

export default router;
