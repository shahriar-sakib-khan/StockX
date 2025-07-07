import bcryptjs from "bcryptjs";

const compareHashedPassword = async (password, hashedPassword) => {
  const isMatch = bcryptjs.compare(password, hashedPassword);
  return isMatch;
};

export default compareHashedPassword;
