import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Router } from "express";

// <============================> INTERNAL IMPORTS <============================>

import connectDB from "./config/db.js";
import { v1Router } from "./routes/index.js";

// <============================> IMPORTS END HERE  <============================>

const app = express();
const router = Router();

app.use(express.json());

router.use("/api/v1", v1Router);

// <============================> SERVER STARTS HERE! <============================>

const PORT = process.env.PORT || 5000;
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
