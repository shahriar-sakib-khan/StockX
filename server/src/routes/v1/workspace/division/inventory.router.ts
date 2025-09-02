import { Router } from 'express';

import { inventoryController } from '@/controllers/v1';
import { divisionScope } from '@/middlewares';

const router = Router({ mergeParams: true });

// <============================> Brand Routers <============================>

/**
 * @route   GET /:workspaceId/divisions/:divisionId/inventory/brands
 * @desc    Get all active brands in a division
 * @access  Authenticated
 */
router.get('/brands', inventoryController.activeLocalBrands);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/inventory/all-brands
 * @desc    Get all brands in a division
 * @access  Authenticated
 */
router.get('/all-brands', inventoryController.allLocalBrands);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/inventory/brands/d
 * @desc    Get all brands in a division with details
 * @access  Authenticated
 */
router.get('/brands/d', inventoryController.detailedLocalBrands);

/**
 * @route   PATCH /:workspaceId/divisions/:divisionId/inventory/brands
 * @desc    Select brands in a division
 * @access  Division admin
 */
router.patch('/brands', divisionScope(['division_admin']), inventoryController.selectBrands);

// <============================> Cylinder Routers <============================>

/**
 * @route   GET /:workspaceId/divisions/:divisionId/inventory/cylinders
 * @desc    Get all cylinders in a division
 * @access  Authenticated
 */
router.get('/cylinders', inventoryController.allCylinders);

// router.post('/cylinders', inventoryController.addCylinder);
// router.put('/cylinders/:cylinderId', inventoryController.updateCylinder);
// router.delete('/cylinders/:cylinderId', inventoryController.deleteCylinder);

export default router;
