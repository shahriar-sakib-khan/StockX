import { StatusCodes } from "http-status-codes";

/**
 * Middleware to authorize based on allowed roles.
 * Supports users with multiple roles (roles: [String]).
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (
      !req.user ||
      !req.user.roles?.some((role) => allowedRoles.includes(role))
    ) {
      return res.status(StatusCodes.FORBIDDEN).json({ msg: "Access denied" });
    }
    next();
  };
};
