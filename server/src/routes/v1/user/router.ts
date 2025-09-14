import { Router } from 'express';

import { userController } from '@/controllers/v1/index.js';
import { validateRequest } from '@/middlewares/index.js';
import { user } from '@/validations/index.js';
import userInviteRouter from './userInvite.router.js';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile routes
 */
const router = Router();

/**
 * ----------------- User Routes -----------------
 */

/**
 * @route   GET /user/me
 * @desc    Get the currently authenticated user's profile
 * @access  Private
 */
router.get('/me', userController.getCurrentUser);

/**
 * @route   PUT /user/me
 * @desc    Update the currently authenticated user's profile
 * @access  Private
 */
router.patch('/me', validateRequest(user.updateUserSchema), userController.updateUser);

/**
 * ----------------- User Invite Sub-routes -----------------
 */
router.use('/invites', userInviteRouter);

export default router;
