import jwt from "jsonwebtoken";

const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

export default verifyJWT;
