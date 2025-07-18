import jwt from "jsonwebtoken";
import { Errors } from "../error/index.js";

/**
 * Create a JWT token
 */
export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    algorithm: "HS256",
  });
  return token;
};

/**
 * Verify a JWT token with secret key
 */
export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, roles } = decoded;

  if (!userId || !roles) throw new Errors.UnauthorizedError("Invalid token");
  return { userId, roles };
};

// <============================>  <============================>

/**
 * Create an **Access Token** (short-lived, frequent usage)
 */
export const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    algorithm: "HS256",
  });
};

/**
 * Create a **Refresh Token** (long-lived, used for re-authentication)
 */
export const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    algorithm: "HS256",
  });
};

/**
 * Verify **Access Token**
 */
export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, superRole } = decoded;
  if (!userId || !superRole)
    throw new Errors.UnauthorizedError("Invalid token");
  return { userId, superRole };
};

/**
 * Verify **Refresh Token**
 */
export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const { userId } = decoded;
  if (!userId) throw new Errors.UnauthorizedError("Invalid refresh token");
  return { userId };
};
