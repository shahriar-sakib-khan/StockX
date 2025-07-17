import { User } from "../../models/index.js";
import { BadRequestError, NotFoundError } from "../../error/customErrors.js";

/**
 * Get Current User
 */
export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) throw new NotFoundError("User not found");

  return user;
};

/**
 * Update Current User
 */
export const updateUserService = async (userId, userData) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "username",
    "email",
    "address",
  ];
  const updates = {};

  allowedFields.forEach((field) => {
    if (userData[field] !== undefined) updates[field] = userData[field];
  });

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError("No valid fields provided for update");
  }

  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new BadRequestError("Email already exists");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) throw new NotFoundError("User not found");

  return updatedUser;
};

// <============================> mods <============================>

/**
 * Get Stats
 */
export const getApplicationStatsService = async () => {
  const totalUsers = await User.countDocuments();
  return { totalUsers };
};

/**
 * Get All Users
 */
export const getAllUsersService = async (page, limit) => {
  const skip = (page - 1) * limit;
  const users = await User.find().skip(skip).limit(limit).select("-password");
  const totalUsers = await User.countDocuments();
  return { users, totalUsers };
};

/**
 * Get Single User
 */
export const getSingleUserService = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new NotFoundError("User not found");
  return user;
};

// <============================> admin <============================>

/**
 * Update any User
 */
export const adminUpdateUserService = async (id, userData) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "username",
    "email",
    "address",
    "roles",
  ];
  const updates = {};

  allowedFields.forEach((field) => {
    if (userData[field] !== undefined) updates[field] = userData[field];
  });

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError("No valid fields provided for update");
  }

  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email });
    if (existingUser && existingUser._id.toString() !== id) {
      throw new BadRequestError("Email already exists");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) throw new NotFoundError("User not found");

  return updatedUser;
};

/**
 * Delete any User
 */
export const adminDeleteUserService = async (adminUserId, id) => {
  if (adminUserId === id) throw new BadRequestError("That's YOUR ID man!");

  const user = await User.findByIdAndDelete(id);
  if (!user) throw new NotFoundError(`No user found with id ${id}`);

  return user;
};
