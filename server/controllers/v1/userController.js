import { StatusCodes } from "http-status-codes";

import { NotFoundError, BadRequestError } from "../../error/customErrors.js";
import { User } from "../../models/index.js";

/**
 * @desc Current user
 */
export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) throw new NotFoundError("User not found");
  res.status(StatusCodes.OK).json({ user });
};

/**
 * @desc Update current user
 */
export const updateUser = async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "username",
    "email",
    "location",
  ];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError("No valid fields provided for update");
  }

  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email });
    if (existingUser && existingUser._id.toString() !== req.user.userId) {
      throw new BadRequestError("Email already exists");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) throw new NotFoundError("User not found");
  res.status(StatusCodes.OK).json({ msg: "User updated", user: updatedUser });
};

// <============================> Moderator User <============================>

/**
 * @desc Platform usage stats (moderator/admin)
 */
export const getApplicationStats = async (req, res) => {
  const totalUsers = await User.countDocuments();

  res.status(StatusCodes.OK).json({ stats: { totalUsers } });
};

/**
 * @desc Admin get all users
 */
export const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const users = await User.find().skip(skip).limit(limit).select("-password");
  const totalUsers = await User.countDocuments();

  res.status(StatusCodes.OK).json({ page, limit, totalUsers, users });
};

/**
 * @desc Admin get user by ID
 */
export const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) throw new NotFoundError("User not found");
  res.status(StatusCodes.OK).json({ user });
};

// <============================> Admin User <============================>

/**
 * @desc Update any user (admin only)
 */
export const adminUpdateUser = async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "username",
    "email",
    "location",
    "role",
  ]; // can update role from here
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError("No valid fields provided for update");
  }

  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email });
    if (existingUser && existingUser._id.toString() !== req.params.id) {
      throw new BadRequestError("Email already exists");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) throw new NotFoundError("User not found");
  res.status(StatusCodes.OK).json({ msg: "User updated", user: updatedUser });
};

/**
 * @desc Admin delete user
 */
export const adminDeleteUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.userId === id) {
    throw new BadRequestError("That's YOUR ID man!");
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new NotFoundError(`No user found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({
    msg: `Deleted user with id ${id}`,
    user: { id: user._id, username: user.username, email: user.email },
  });
};
