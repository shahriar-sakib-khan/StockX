import { Router } from 'express';

import { localBrandController } from './index.js';

/**
 * @swagger
 * tags:
 *   name: LocalBrand
 *   description: Local brand management and brand-cylinder linkage
 */

const router = Router({ mergeParams: true });

/**
 * ----------------- General Local Brand Routes -----------------
 */

/**
 * @route   GET /stores/:storeId/brands?page=1&limit=20&mode=active|all|detailed
 * @desc    Get all local brands in a store with optional mode.
 * @query   page (optional) - number (default: 1)
 * @query   limit (optional) - number (default: 20)
 * @query   mode - string ('active' | 'all' | 'detailed')
 * @access  Authenticated
 */
router.get('/brands', localBrandController.getAllLocalBrands);

/**
 * ----------------- Local Brand Selection Routes -----------------
 */

/**
 * @route   PATCH /stores/:storeId/brands/select
 * @desc    Update active/inactive status of local brands and sync with related cylinders.
 * @body    [{ id: string, isActive: boolean }]
 * @access  Authenticated
 */
router.patch('/brands/select', localBrandController.selectLocalBrands);

/**
 * ----------------- Default Export -----------------
 */
export default router;
