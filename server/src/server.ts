import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// <============================> INTERNAL IMPORTS <============================>

import connectDB from './config/db.config.js';
import { v1Router } from './routes/index.js';
import { errorHandler } from './error/index';

// <============================> IMPORTS END HERE  <============================>

const app = express();

app.use(express.urlencoded({ extended: true })); // for form-urlencoded (IPN)
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', v1Router);

app.use(errorHandler); // All uncaught errors

// <============================> SERVER STARTS HERE! <============================>

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Failed to start server:', err.message);
    } else {
      console.error('❌ Unknown failure:', err);
    }
    process.exit(1);
  }
};

startServer();
