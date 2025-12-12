import { Router } from 'express';

import { userController, userValidator } from './user/index.js';

import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: User
 * description: User profile management
 */

/**
 * @route   GET /users/me
 * @desc    Get current user profile
 * @access  Authenticated
 */
router.get('/users/me', userController.getCurrentUser);

/**
 * @route   PATCH /users/me
 * @desc    Update current user profile
 * @access  Authenticated
 */
router.patch(
  '/users/me',
  validateRequest(userValidator.updateUserSchema),
  userController.updateUser
);

export default router;
