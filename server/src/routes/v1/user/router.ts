import { Router } from 'express';

import { userController } from '@/controllers/v1';
import { validateRequest } from '@/middlewares';
import { user } from '@/validations';

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

export default router;
