import { inventoryController } from '@/controllers/v1';
import { Router } from 'express';

const router = Router({ mergeParams: true });

// <============================> Division brands <============================>
/**
 * @route   GET /:workspaceId/divisions/:divisionId/inventory/brands
 * @desc    Get all brands in a division
 * @access  Authenticated
 */
router.get('/brands', inventoryController.allLocalBrands);

// <============================> Detailed division brands <============================>
/**
 * @route   GET /:workspaceId/divisions/:divisionId/inventory/brands/d
 * @desc    Get all brands in a division with details
 * @access  Authenticated
 */
router.get('/brands/d', inventoryController.detailedLocalBrands);


/**
 * @route   POST /:workspaceId/divisions/:divisionId/inventory/brands
 * @desc    Select brands in a division
 * @access  Division admin
 */
router.post('/brands', inventoryController.selectBrands);


export default router;
