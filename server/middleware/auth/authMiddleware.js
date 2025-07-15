import { UnauthenticatedError } from "../../error/customErrors.js";
import { verifyJWT } from "../../utils/jwtTokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("Authentication required");

  const { userId, roles } = verifyJWT(token);

  req.user = { userId, roles };

  next();
};
