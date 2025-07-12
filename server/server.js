import * as dotenv from "dotenv";
dotenv.config();

import express from "express";

// <============================> INTERNAL IMPORTS <============================>

import connectDB from "./config/db.js";
import { v1Router } from "./routes/index.js";
import { errorHandlerMiddleware } from "./middleware/index.js";

// <============================> IMPORTS END HERE  <============================>

const app = express();

app.use(express.json());

app.use("/api/v1", v1Router);

app.use(errorHandlerMiddleware); // All uncaught errors

// <============================> SERVER STARTS HERE! <============================>

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
