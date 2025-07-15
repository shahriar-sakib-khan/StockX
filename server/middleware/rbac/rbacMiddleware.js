import { StatusCodes } from "http-status-codes";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ msg: "Access denied" });
    }
    next();
  };
};
