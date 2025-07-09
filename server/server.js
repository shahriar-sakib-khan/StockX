import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

// <============================> INTERNAL IMPORTS <============================>

import connectDB from "./config/db.js";
import router from "./routes/index.js";

// <============================> IMPORTS END HERE  <============================>

app.use(express.json());
app.use("/api/v1", router);

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
