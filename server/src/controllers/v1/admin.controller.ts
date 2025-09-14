/**
 * ----------------- Admin User Controller -----------------
 *
 * Manages admin-level operations for user management and global brands.
 *
 * @module controllers/adminUser
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { adminUserService, brandService } from '@/services/v1/index.js';
import { assertAuth } from '@/common/index.js';

/**
 * ----------------- Admin User CRUD -----------------
 */

export const getAllUsers = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { users, totalUsers } = await adminUserService.getAllUsers(page, limit);

  res.status(StatusCodes.OK).json({ totalUsers, page, limit, users });
};

export const getSingleUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await adminUserService.getSingleUser(userId);

  res.status(StatusCodes.OK).json({ user });
};

export const adminUpdateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const updatedUser = await adminUserService.adminUpdateUser(userId, req.body);

  res.status(StatusCodes.OK).json({
    message: 'User updated successfully',
    user: updatedUser,
  });
};

export const adminDeleteUser = async (req: Request, res: Response) => {
  assertAuth(req);

  const { userId } = req.params;
  const { userId: adminId } = req.user;

  const deletedUser = await adminUserService.adminDeleteUser(adminId, userId);

  res.status(StatusCodes.OK).json({
    message: 'User deleted successfully',
    user: deletedUser,
  });
};

/**
 * ----------------- Admin Global Brands -----------------
 */

export const detailedGlobalBrands = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { globalBrands, total } = await brandService.getDetailedGlobalBrands(page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, globalBrands });
};

/**
 * ----------------- Default export (admin controllers) -----------------
 */
export default {
  // Admin User CRUD
  getAllUsers, // Paginated minimal users for admin dashboard
  getSingleUser, // Fetch a single user by ID
  adminUpdateUser, // Admin updates allowed fields for a user
  adminDeleteUser, // Admin deletes a user (self-deletion prevented)

  // Admin Global Brands
  detailedGlobalBrands, // Paginated global brand listing
};
