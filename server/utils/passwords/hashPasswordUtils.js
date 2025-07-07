import bcryptjs from "bcryptjs";

const hashPassword = async (plainPassword) => {
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(plainPassword, salt);
  return hashedPassword;
};

export default hashPassword;
