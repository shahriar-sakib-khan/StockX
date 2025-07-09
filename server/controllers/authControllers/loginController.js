import User from "../../models/userModel.js";
import { compareHashedPassword } from "../../utils/passwords/index.js";
import { createJWT } from "../../utils/jwt/index.js";

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const isValidCredentials =
      user && (await compareHashedPassword(req.body.password, user.password));

    if (isValidCredentials) {
      const token = createJWT({ userID: user._id });
      const oneDay = 1000 * 60 * 60 * 24 * 1;
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(200).json({ msg: "login successful" });
    } else {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default login;
