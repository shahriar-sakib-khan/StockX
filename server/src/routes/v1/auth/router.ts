import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';
import { auth } from '@/validations/index.js';
import { authController } from '@/controllers/v1/index.js';
import { requireAuth } from '@/middlewares/index.js';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(auth.registerSchema), authController.register);

/**
 * @route   POST /auth/login
 * @desc    Log in a user with username/email and password
 * @access  Public
 */
router.post('/login', validateRequest(auth.loginSchema), authController.login);

/**
 * @route   POST /auth/logout
 * @desc    Log out the currently authenticated user
 * @access  Private
 */
router.post('/logout', requireAuth, authController.logout);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh the access token using a valid refresh token
 * @access  Public
 */
router.post('/refresh', authController.refreshAccessToken);

export default router;
