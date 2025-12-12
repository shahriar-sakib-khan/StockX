import { Router } from 'express';

import { authController, authValidator } from './auth/index.js';

import { validateRequest } from '@/middlewares/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Authentication management
 */

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 */
router.post(
  '/auth/register',
  validateRequest(authValidator.registerSchema),
  authController.register
);

/**
 * @route   POST /auth/login
 * @desc    Login user
 */
router.post('/auth/login', validateRequest(authValidator.loginSchema), authController.login);

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 */
router.post('/auth/logout', authController.logout);

/**
 * @route   POST /auth/refresh
 * @desc    Get new access token
 */
router.post('/auth/refresh', authController.refreshAccessToken);

export default router;
