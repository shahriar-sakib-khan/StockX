import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';

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
 * @route   GET /user
 * @desc    Retrieve the currently authenticated user's profile
 * @access  Authenticated
 */
router.get('/user', userController.getCurrentUser);

/**
 * @route   PUT /user
 * @desc    Update the currently authenticated user's profile
 * @access  Authenticated
 */
router.put('/user', validateRequest(userValidator.updateUserSchema), userController.updateUser);

export default router;
