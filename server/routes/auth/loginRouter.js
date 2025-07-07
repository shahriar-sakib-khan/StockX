import { Router } from "express";
const router = Router();

import User from "../../models/userModel.js";
import { compareHashedPassword } from "../../utils/passwords/index.js";

router.post("/", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    const isValidCredentials =
      user && (await compareHashedPassword(req.body.password, user.password));

    if (isValidCredentials) {
      return res.status(200).json({ login: "login successful" });
    } else {
      return res.status(401).json({ login: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
