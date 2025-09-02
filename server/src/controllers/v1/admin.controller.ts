/**
 * ----------------- Admin User Controller -----------------
 *
 * Handles all logic for admin user management and application stats.
 *
 * @module controllers/adminUser
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { adminUserService, brandService } from '@/services/v1';
import { assertAuth } from '@/common';

/**
 * ----------------- Admin User CRUD -----------------
 */

/**
 * @function getAllUsers
 * @desc Retrieves paginated users (minimal fields) for admin view.
 * @route GET /api/v1/admin/users
 * @access Private (Admin)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  assertAuth(req);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { users, totalUsers } = await adminUserService.getAllUsers(page, limit);

  res.status(StatusCodes.OK).json({ totalUsers, page, limit, users });
};

/**
 * @function getSingleUser
 * @desc Retrieves a single user by ID with full sanitized fields.
 * @route GET /api/v1/admin/users/:userId
 * @access Private (Admin)
 */
export const getSingleUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await adminUserService.getSingleUser(userId);

  res.status(StatusCodes.OK).json({ user });
};

/**
 * @function adminUpdateUser
 * @desc Admin updates any user's allowed fields and returns sanitized updated user.
 * @route PATCH /api/v1/admin/users/:userId
 * @access Private (Admin)
 */
export const adminUpdateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const updatedUser = await adminUserService.adminUpdateUser(userId, req.body);

  res.status(StatusCodes.OK).json({ message: 'User updated successfully', user: updatedUser });
};

/**
 * @function adminDeleteUser
 * @desc Admin deletes a user (cannot delete self), returns sanitized deleted user.
 * @route DELETE /api/v1/admin/users/:userId
 * @access Private (Admin)
 */
export const adminDeleteUser = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.params;
  const { userId: adminId } = req.user;

  const deletedUser = await adminUserService.adminDeleteUser(adminId, userId);

  res.status(StatusCodes.OK).json({ message: 'User deleted successfully', user: deletedUser });
};

/**
 * ----------------- Admin Brands -----------------
 */
export const detailedGlobalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { globalBrands, total } = await brandService.getDetailedGlobalBrands(page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, globalBrands });
};

export const addGlobalBrand = async (req: Request, res: Response) => {
  const newBrand = brandService.addGlobalBrand();
  res.status(StatusCodes.OK).json({ newBrand });
};

/**
 * ----------------- Default export (admin controllers) -----------------
 */
export default {
  // Admin User CRUD
  getAllUsers, // Get paginated users (minimal fields) for admin view
  getSingleUser, // Get a single user by ID with full sanitized fields
  adminUpdateUser, // Admin updates allowed fields for a user
  adminDeleteUser, // Admin deletes a user (prevents self-deletion)

  // Admin Brands
  addGlobalBrand,
  detailedGlobalBrands,
};
