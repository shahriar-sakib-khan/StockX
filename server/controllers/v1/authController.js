import { StatusCodes } from "http-status-codes";

import { User } from "../../models/index.js";
import {
  hashPassword,
  compareHashedPassword,
  createJWT,
} from "../../utils/index.js";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../../error/customErrors.js";

/**
 * Register Controller
 */
export const register = async (req, res) => {
  const { name, lastName, username, email, password, location } = req.body;

  if (!name || !username || !email || !password || !location) {
    throw new BadRequestError(
      "Name, email, password and location are required"
    );
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    lastName,
    username,
    email,
    password: hashedPassword,
    location,
  });

  res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
    user,
  });
};

/**
 * Login Controller
 */
export const login = async (req, res) => {
  const { loginIdentifier, password } = req.body;

  if (!loginIdentifier || !password) {
    throw new BadRequestError("Username/email and password are required");
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);
  const user = await User.findOne(
    isEmail ? { email: loginIdentifier } : { name: loginIdentifier }
  );

  const isValid =
    user && (await compareHashedPassword(password, user.password));

  if (!isValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = createJWT({ userID: user._id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24 ** 1;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneDay),
    sameSite: "Strict",
  });

  res.status(StatusCodes.OK).json({
    message: "Login successful",
    user,
  });
};

/**
 * Logout Controller
 */
export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "Strict",
  });

  res.status(StatusCodes.OK).json({ message: "User logged out" });
};
