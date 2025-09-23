import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';

import { globalBrandController, globalBrandValidator } from './index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Global Brand
 *   description: Routes for managing global brands
 */

/**
 * ----------------- Global Brand CRUD -----------------
 */

/**
 * @route   POST /global-brands
 * @desc    Create a new global brand
 * @access  Private
 */
router.post(
  '/',
  validateRequest(globalBrandValidator.createGlobalBrandSchema),
  globalBrandController.createGlobalBrand
);

/**
 * @route   GET /global-brands
 * @desc    Get all global brands (paginated)
 * @access  Public
 */
router.get('/', globalBrandController.getAllGlobalBrands);

/**
 * @route   GET /global-brands/:brandId
 * @desc    Get details of a single global brand
 * @access  Public
 */
router.get('/:brandId', globalBrandController.getGlobalBrandById);

/**
 * @route   PUT /global-brands/:brandId
 * @desc    Update a global brand
 * @access  Private
 */
router.put(
  '/:brandId',
  validateRequest(globalBrandValidator.updateGlobalBrandSchema),
  globalBrandController.updateGlobalBrand
);

/**
 * @route   DELETE /global-brands/:brandId
 * @desc    Delete a global brand
 * @access  Private
 */
router.delete('/:brandId', globalBrandController.deleteGlobalBrand);

export default router;
