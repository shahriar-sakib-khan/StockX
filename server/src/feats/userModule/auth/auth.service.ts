import { Errors } from '@/error/index.js';
import { Passwords, JWTs } from '@/utils/index.js';

import { User, userSanitizers } from '../index.js';
import { authValidator } from './index.js';

/**
 * Registers a new user.
 *
 * @param {authValidator.RegisterInput} userData - Incoming user data.
 * @returns {Promise<userSanitizers.SanitizedUser>} Sanitized user object.
 * @throws {Errors.BadRequestError} If email or username already exists.
 */
export const registerUser = async (
  userData: authValidator.RegisterInput
): Promise<userSanitizers.SanitizedUser> => {
  const { firstName, lastName, username, email, password, address } = userData;

  const existingUsers = await User.find({
    $or: [{ email }, { username }],
  }).select('email username');

  if (existingUsers.length) {
    if (existingUsers.some(u => u.email === email))
      throw new Errors.BadRequestError('Email already exists');
    if (existingUsers.some(u => u.username === username))
      throw new Errors.BadRequestError('Username already exists');
  }

  const hashedPassword = await Passwords.hashPassword(password);
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    address,
    password: hashedPassword,
  });

  return userSanitizers.userSanitizer(user);
};

/**
 * Authenticates a user.
 *
 * @param {authValidator.LoginInput} credentials - Login credentials.
 * @returns {Promise<userSanitizers.SanitizedUser>} Authenticated user.
 * @throws {Errors.UnauthenticatedError} If credentials are invalid.
 */
export const loginUser = async ({
  loginIdentifier,
  password,
}: authValidator.LoginInput): Promise<userSanitizers.SanitizedUser> => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);

  const user = await User.findOne(
    isEmail ? { email: loginIdentifier } : { username: loginIdentifier }
  ).select('+password');

  if (!user) throw new Errors.UnauthenticatedError('Invalid credentials');

  const isValid = await Passwords.compareHashedPassword(password, user.password);
  if (!isValid) throw new Errors.UnauthenticatedError('Invalid credentials');

  return userSanitizers.userSanitizer(user);
};

/**
 * Generates a new access token from a refresh token.
 *
 * @param {string} refreshToken - User refresh token.
 * @returns {string} New access token.
 * @throws {Errors.UnauthenticatedError} If token is missing or invalid.
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  if (!refreshToken) throw new Errors.UnauthenticatedError('Refresh token missing');

  const { userId } = JWTs.verifyRefreshToken(refreshToken);
  const user = await User.findById(userId);
  if (!user) throw new Errors.NotFoundError('User not found');

  return JWTs.createAccessToken({
    userId,
    role: user.role,
  });
};

export default {
  registerUser, // Register a new user
  loginUser, // Log in a user
  refreshAccessToken, // Refresh access token
};
