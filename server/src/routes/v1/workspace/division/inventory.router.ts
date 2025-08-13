import { inventoryController } from '@/controllers/v1';
import { Router } from 'express';

const router = Router({ mergeParams: true });

// <============================> Brand Controllers <============================>

/**
 * @route   GET /:workspaceId/divisions/:divisionId/inventory/global-brands
 * @desc    Get all global brands
 * @access  Authenticated
 */
router.get('/global-brands', inventoryController.allGlobalBrands);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/inventory/brands
 * @desc    Get all brands in a division
 * @access  Authenticated
 */
router.get('/brands', inventoryController.allLocalBrands);

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
router.patch('/brands', inventoryController.selectBrands);

// <============================> Cylinder Controllers <============================>

router.get('/cylinders', inventoryController.allCylinders);

export default router;
