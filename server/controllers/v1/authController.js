import { StatusCodes } from "http-status-codes";

import { authService } from "../../services/v1/index.js";
import { createJWT } from "../../utils/index.js";

/**
 * Register Controller
 */
export const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "User registered successfully", user });
};

/**
 * Login Controller
 */
export const login = async (req, res) => {
  const user = await authService.loginUser(req.body);

  const token = createJWT({ userId: user._id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24 * 1;

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
