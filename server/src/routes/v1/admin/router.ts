import { Router } from 'express';

import { adminController } from '@/controllers/v1';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin (ostad) routes
 */

// <============================> Global brand routes <============================>

/**
 * @route   GET /admin/brands/d
 * @desc    Get all global brands with details
 * @access  master admin (Ostad)
 */
router.get('/brands/d', adminController.detailedGlobalBrands);

/**
 * @route   POST /admin/brands
 * @desc    Add global brand
 * @access  master admin (Ostad)
 */
router.post('/brands', adminController.addGlobalBrand);

export default router;
