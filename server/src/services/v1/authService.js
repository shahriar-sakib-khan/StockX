import { User } from '@/models/index.js';
import { Passwords } from '@/utils/index.js';
import { Errors } from '@/error/index.js';

/**
 * Register a new user.
 * Sanitizes input, hashes password, and creates the user record.
 *
 * @param {Object} userData - Incoming user data from request body.
 * @returns {Promise<User>} - Newly created user document.
 * @throws {Errors.ValidationError} - If required fields missing or invalid (optional to add).
 */
export const registerUser = async userData => {
  const allowedFields = ['firstName', 'lastName', 'username', 'email', 'address'];

  const sanitizedUserData = {};
  allowedFields.forEach(field => {
    if (userData[field] !== undefined) sanitizedUserData[field] = userData[field];
  });

  const hashedPassword = await Passwords.hashPassword(userData.password);

  const user = await User.create({
    ...sanitizedUserData,
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
export const loginUser = async ({ loginIdentifier, password }) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);

  const user = await User.findOne(
    isEmail ? { email: loginIdentifier } : { username: loginIdentifier }
  );
  if (!user) throw new Errors.UnauthenticatedError('Invalid credentials');

  const isValid = await Passwords.compareHashedPassword(password, user.password);
  if (!isValid) throw new Errors.UnauthenticatedError('Invalid credentials');

  return user;
};
