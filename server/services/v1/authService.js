import { User } from "../../models/index.js";
import { hashPassword, compareHashedPassword } from "../../utils/index.js";
import { UnauthenticatedError } from "../../error/customErrors.js";

/**
 * Register User
 */
export const registerUser = async (userData) => {
  const hashedPassword = await hashPassword(userData.password);

  const user = User.create({ ...userData, password: hashedPassword });

  return user;
};

/**
 * Login User
 */
export const loginUser = async ({ loginIdentifier, password }) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);

  const user = await User.findOne(
    isEmail ? { email: loginIdentifier } : { username: loginIdentifier }
  );
  if (!user) throw new UnauthenticatedError("Invalid credentials");

  const isValid = await compareHashedPassword(password, user.password);
  if (!isValid) throw new UnauthenticatedError("Invalid credentials");

  return user;
};

