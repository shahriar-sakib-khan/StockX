import { HydratedDocument } from 'mongoose';

import { User, IUser } from '@/models';
import { JWTs, Passwords } from '@/utils';
import { Errors } from '@/error';
import { RegisterInput, LoginInput } from '@/validations/auth.validation';

/**
 * Register a new user.
 * Sanitizes input, hashes password, and creates the user record.
 *
 * @param {Object} userData - Incoming user data from request body.
 * @returns {Promise<User>} - Newly created user document.
 * @throws {Errors.ValidationError} - If required fields missing or invalid (optional to add).
 */
export const registerUser = async (userData: RegisterInput): Promise<HydratedDocument<IUser>> => {
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

  return user;
};

/**
 * Authenticate user by email or username and password.
 *
 * @param {Object} credentials - Object with loginIdentifier and password.
 * @param {string} credentials.loginIdentifier - Username or email.
 * @param {string} credentials.password - Plain text password to verify.
 * @returns {Promise<User>} - Authenticated user document.
 * @throws {Errors.UnauthenticatedError} - If user not found or password invalid.
 */
export const loginUser = async ({
  loginIdentifier,
  password,
}: LoginInput): Promise<HydratedDocument<IUser>> => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);

  const user = await User.findOne(
    isEmail ? { email: loginIdentifier } : { username: loginIdentifier }
  ).select('+password');

  if (!user) throw new Errors.UnauthenticatedError('Invalid credentials');

  const isValid = await Passwords.compareHashedPassword(password, user.password);
  if (!isValid) throw new Errors.UnauthenticatedError('Invalid credentials');

  return user;
};

/**
 * Generates a new access token using a valid refresh token.
 *
 * @param {string} refreshToken - Incoming user data from req.user.
 * @returns {string} - Generated access token.
 * @throws {Errors.UnauthenticatedError} - If user object is not found on request.
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  if (!refreshToken) throw new Errors.UnauthenticatedError('Refresh token missing');

  const { userId } = JWTs.verifyRefreshToken(refreshToken);

  const user = await User.findById(userId);
  if (!user) throw new Errors.NotFoundError('User not found');

  const accessToken = JWTs.createAccessToken({
    userId,
    role: user.role,
  });

  return accessToken;
};

export default { registerUser, loginUser, refreshAccessToken };
