import * as dotenv from "dotenv";
dotenv.config();

import express from "express";

import User from "./models/userModel.js";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());

app.get("/api/v1/login", (req, res) => {
  console.log("tried to login");
  res.json({ login: "login" });
});

app.post("/api/v1/register", async (req, res) => {
  try {
    console.log("tried to register");
    const user = await User.create(req.body);
    res.status(201).json({ register: user });
  } catch (err) {
    console.error("Registration failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// <============================> Server starts here! <============================>

const PORT = process.env.PORT || 5100
const startServer = async () => {
  try {
    await connectDB(); // configured in config/db.js
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();