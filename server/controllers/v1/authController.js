import { User } from "../../models/index.js";
import {
  compareHashedPassword,
  hashPassword,
  createJWT,
} from "../../utils/index.js";

// <============================> Register Controller <============================>

export const register = async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);

    res.status(201).json({ msg: "user registered", register: user });
  } catch (err) {
    console.error("Registration failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// <============================> Login Controller <============================>

export const login = async (req, res) => {
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

// <============================> Logout Controller <============================>

export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.json({ msg: "user logged out" });
};
