import { Router } from 'express';

import { validateRequest } from '@/middlewares';
import { adminController } from '@/controllers/v1';
import { user } from '@/validations';

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin (ostad) routes
 */
const router = Router();

/**
 * ----------------- Admin User CRUD -----------------
 */

/**
 * @route   GET /admin/users
 * @desc    Get paginated users for admin view
 * @access  Private (admin)
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   GET /admin/users/:userId
 * @desc    Get a single user by ID with full sanitized fields
 * @access  Private (admin)
 */
router.get('/users/:userId', adminController.getSingleUser);

/**
 * @route   PATCH /admin/users/:userId
 * @desc    Admin updates allowed fields for a user
 * @access  Private (admin)
 */
router.patch(
  '/users/:userId',
  validateRequest(user.updateUserAdminSchema),
  adminController.adminUpdateUser
);

/**
 * @route   DELETE /admin/users/:userId
 * @desc    Admin deletes a user (cannot delete self)
 * @access  Private (admin)
 */
router.delete('/users/:userId', adminController.adminDeleteUser);

/**
 * ----------------- Admin Brands -----------------
 */

export default router;
