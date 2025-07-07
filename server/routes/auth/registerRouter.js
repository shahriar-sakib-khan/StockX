import { Router } from "express";
const router = Router();

import User from "../../models/userModel.js";

router.post("/", async (req, res) => {
  try {
    console.log("tried to register");
    const user = await User.create(req.body);
    res.status(201).json({ register: user });
  } catch (err) {
    console.error("Registration failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
