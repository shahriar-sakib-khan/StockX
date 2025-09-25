import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest.js';

import { userValidator, userController } from '@/feats/userModule/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User account management
 */

/**
 * ----------------- User Routes -----------------
 */

/**
 * @route   GET /user/me
 * @desc    Retrieve the currently authenticated user's profile
 * @access  Authenticated
 */
router.get('/user/me', userController.getCurrentUser);

/**
 * @route   PATCH /user
 * @desc    Update the currently authenticated user's profile
 * @access  Authenticated
 */
router.patch('/user', validateRequest(userValidator.updateUserSchema), userController.updateUser);

export default router;
