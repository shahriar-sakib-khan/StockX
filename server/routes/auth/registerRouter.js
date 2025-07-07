import { Router } from "express";
const router = Router();

import User from "../../models/userModel.js";
import { hashPassword } from "../../utils/passwords/index.js";

router.post("/", async (req, res) => {
  try {
    console.log("tried to register");

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);

    res.status(201).json({ register: user });
  } catch (err) {
    console.error("Registration failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
