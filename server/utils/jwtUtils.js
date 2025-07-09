import jwt from "jsonwebtoken";

/**
 * Create a JWT token
 */
  export const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  };

/**
 * Verify a JWT token with secret key
 */
export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

