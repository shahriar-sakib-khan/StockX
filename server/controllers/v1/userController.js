import { StatusCodes } from "http-status-codes";

import { userService } from "../../services/v1/index.js";

/**
 * @desc Current user
 */
export const getCurrentUser = async (req, res) => {
  const user = await userService.getCurrentUserService(req.user.userId);

  res.status(StatusCodes.OK).json({ user });
};

/**
 * @desc Update current user
 */
export const updateUser = async (req, res) => {
  const updatedUser = await userService.updateUserService(
    req.user.userId,
    req.body
  );
  res.status(StatusCodes.OK).json({ msg: "User updated", user: updatedUser });
};

// <============================> Moderator <============================>

/**
 * @desc Platform usage stats (moderator/admin)
 */
export const getApplicationStats = async (req, res) => {
  const stats = await userService.getApplicationStatsService();
  res.status(StatusCodes.OK).json({ stats });
};

/**
 * @desc Admin get all users
 */
export const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const { users, totalUsers } = await userService.getAllUsersService(
    page,
    limit
  );
  res.status(StatusCodes.OK).json({ page, limit, totalUsers, users });
};

/**
 * @desc Admin get user by ID
 */
export const getSingleUser = async (req, res) => {
  const user = await userService.getSingleUserService(req.params.id);
  res.status(StatusCodes.OK).json({ user });
};

// <============================> Admin User <============================>

/**
 * @desc Update any user (admin only)
 */
export const adminUpdateUser = async (req, res) => {
  const updatedUser = await userService.adminUpdateUserService(
    req.params.id,
    req.body
  );
  res.status(StatusCodes.OK).json({ msg: "User updated", user: updatedUser });
};

/**
 * @desc Admin delete user
 */
export const adminDeleteUser = async (req, res) => {
  const { id, username, email } = await userService.adminDeleteUserService(
    req.user.userId,
    req.params.id
  );
  res.status(StatusCodes.OK).json({
    msg: `Deleted user with id ${req.params.id}`,
    user: { id, username, email },
  });
};
