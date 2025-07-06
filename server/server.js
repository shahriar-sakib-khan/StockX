import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

import User from "./models/userModel.js";

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

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connected");
    app.listen(5100, () => {
      console.log("server is live!");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
