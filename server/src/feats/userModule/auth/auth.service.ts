import { ClientSession } from 'mongoose';

import { User, IUser, userSanitizers } from '../index.js';

import { authValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { Invite } from '@/models/index.js';
import { Passwords, JWTs, logger } from '@/utils/index.js';

/**
 * @function registerUser
 */
export const registerUser = async (
  userData: authValidator.RegisterInput,
  session?: ClientSession
): Promise<userSanitizers.SanitizedUser> => {
  const { username, email, password, address, firstName, lastName } = userData;

  const existingUsers = await User.find({
    $or: [{ email }, { username }],
  })
    .session(session || null)
    .select('email username')
    .lean();

  if (existingUsers.length) {
    if (existingUsers.some(u => u.email === email))
      throw new Errors.BadRequestError('Email already exists');
    if (existingUsers.some(u => u.username === username))
      throw new Errors.BadRequestError('Username already exists');
  }

  const hashedPassword = await Passwords.hashPassword(password);

  const [newUser] = await User.create(
    [
      {
        username,
        email,
        address,
        firstName,
        lastName,
        password: hashedPassword,
      },
    ],
    { session }
  );

  // Link Invites
  await Invite.updateMany(
    { email, user: null, status: 'pending' },
    { $set: { user: newUser._id, status: 'sent' } },
    { session }
  );

  logger.info(`Global User registered: ${username} (${email})`);

  return userSanitizers.userSanitizer(newUser);
};

/**
 * @function loginUser
 */
export const loginUser = async ({
  loginIdentifier,
  password,
}: authValidator.LoginInput): Promise<userSanitizers.SanitizedUser> => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);

  const user = await User.findOne(
    isEmail ? { email: loginIdentifier } : { username: loginIdentifier }
  )
    .select('+password')
    .lean();

  if (!user) throw new Errors.UnauthenticatedError('Invalid credentials');

  const isValid = await Passwords.compareHashedPassword(
    password,
    (user as unknown as IUser).password!
  );
  if (!isValid) throw new Errors.UnauthenticatedError('Invalid credentials');

  logger.info(`Global User login: ${user.username} (${user._id})`);

  return userSanitizers.userSanitizer(user as unknown as IUser);
};

/**
 * @function refreshAccessToken
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  if (!refreshToken) throw new Errors.UnauthenticatedError('Refresh token missing');

  const { userId } = JWTs.verifyRefreshToken(refreshToken);

  const user = await User.findById(userId).lean();
  if (!user) throw new Errors.NotFoundError('User not found');

  logger.info(`Global User refresh: ${user.username} (${user._id})`);

  return JWTs.createAccessToken({
    userId,
    role: (user as unknown as IUser).role,
  });
};

export const logoutUser = (): void => {
  logger.info(`Global User logged out`);

  return;
};

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
