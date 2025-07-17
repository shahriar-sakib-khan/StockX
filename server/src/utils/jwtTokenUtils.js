import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../error/customErrors.js";

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

  if (!userId || !roles) throw new UnauthorizedError("Invalid token");
  return { userId, roles };
};
