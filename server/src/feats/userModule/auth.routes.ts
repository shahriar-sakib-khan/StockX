import { Router } from 'express';

import { validateRequest, requireAuth } from '@/middlewares/index.js';
import { auth } from '@/validations/index.js';
import { authController } from '@/feats/userModule/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization management
 */

/**
 * ----------------- Authentication Routes -----------------
 */

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/auth/register', validateRequest(auth.registerSchema), authController.register);

/**
 * @route   POST /auth/login
 * @desc    Log in a user using email/username and password
 * @access  Public
 */
router.post('/auth/login', validateRequest(auth.loginSchema), authController.login);

/**
 * @route   POST /auth/logout
 * @desc    Log out the currently authenticated user
 * @access  Private
 */
router.post('/auth/logout', requireAuth, authController.logout);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token using a valid refresh token
 * @access  Public
 */
router.post('/auth/refresh', authController.refreshAccessToken);

export default router;
