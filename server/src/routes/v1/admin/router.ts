import { Router } from "express";

import { addGlobalBrand, allGlobalBrands, detailedGlobalBrands } from "@/controllers/v1/admin.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin (ostad) routes
 */

// <============================> Global brand routes <============================>

/**
 * @route   GET /admin/brands
 * @desc    Get all global brands
 * @access  master admin (Ostad)
 */
router.get('/brands', allGlobalBrands);

/**
 * @route   GET /admin/brands/d
 * @desc    Get all global brands with details
 * @access  master admin (Ostad)
 */
router.get('/brands/d', detailedGlobalBrands);

/**
 * @route   POST /admin/brands
 * @desc    Add global brand
 * @access  master admin (Ostad)
 */
router.post('/brands', addGlobalBrand);

export default router;