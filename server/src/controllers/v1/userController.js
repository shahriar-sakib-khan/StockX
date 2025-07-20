import { StatusCodes } from 'http-status-codes';

import { userService } from '@/services/v1/index.js';

/**
 * @desc Current user
 */
export const getCurrentUser = async (req, res) => {
  const user = await userService.getCurrentUser(req.user.userId);

  res.status(StatusCodes.OK).json({ user });
};

/**
 * @desc Update current user
 */
export const updateUser = async (req, res) => {
  const updatedUser = await userService.updateUser(req.user.userId, req.body);

  res.status(StatusCodes.OK).json({ msg: 'User updated', user: updatedUser });
};

// <============================> Moderator <============================>

/**
 * @desc Platform usage stats (moderator/admin)
 */
export const getApplicationStats = async (req, res) => {
  const stats = await userService.getApplicationStats();

  res.status(StatusCodes.OK).json({ stats });
};

/**
 * @desc Admin get all users
 */
export const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const { users, totalUsers } = await userService.getAllUsers(page, limit);

  res.status(StatusCodes.OK).json({ page, limit, totalUsers, users });
};

/**
 * @desc Admin get user by ID
 */
export const getSingleUser = async (req, res) => {
  const user = await userService.getSingleUser(req.params.id);

  res.status(StatusCodes.OK).json({ user });
};

// <============================> Admin User <============================>

/**
 * @desc Update any user (admin only)
 */
export const adminUpdateUser = async (req, res) => {
  const updatedUser = await userService.adminUpdateUser(req.params.id, req.body);

  res.status(StatusCodes.OK).json({ msg: 'User updated', user: updatedUser });
};

/**
 * @desc Admin delete user
 */
export const adminDeleteUser = async (req, res) => {
  const { id, username, email } = await userService.adminDeleteUser(req.user.userId, req.params.id);

  res.status(StatusCodes.OK).json({
    msg: `Deleted user with id ${req.params.id}`,
    user: { id, username, email },
  });
};
