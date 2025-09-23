// ------------------------------
// Load Environment Variables
// ------------------------------
import 'express-async-errors'; // For handling async errors without try/catch
import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// ------------------------------
// Internal Imports
// ------------------------------
import apiRouter from './routes/router.js';
import { errorHandler } from '@/error/index.js';
import { connectDB } from '@/config/index.js';
import runBootstrap from './bootstrap/index.js';

// ------------------------------
// Initialize Express App
// ------------------------------
const app: Application = express();

// ------------------------------
// Body Parsing & Cookies
// ------------------------------
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser()); // Parse cookies

// ------------------------------
// CORS Setup
// ------------------------------
const allowedOrigins = [
  'https://stockxbd.com',
  'https://www.stockxbd.com',
  'http://localhost:5173',
];

console.log(allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman or server-to-server requests

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn('Blocked by CORS:', origin);
      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
  })
);

// ------------------------------
// Health Check Endpoint
// ------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------
// Mount API Routes
// ------------------------------
app.use('/api', apiRouter);

// ------------------------------
// Global Error Handler
// ------------------------------
app.use(errorHandler);
/**
 * ----------------- Start Server Function -----------------
 */
// ------------------------------
// Start Server Function
// ------------------------------

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Run any initial setup tasks
    await runBootstrap();

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`🌍 Health check: http://domain.com/api/health`);
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Failed to start server:', errorMessage);
    process.exit(1); // Exit if DB or app fails to start
  }
};

startServer();
