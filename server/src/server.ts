// ------------------------------
// Load Environment Variables and Dependencies
// ------------------------------
import './config/env.config.js';
import 'express-async-errors'; // Catch async errors automatically without try/catch

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';

// ------------------------------
// Internal Imports
// ------------------------------
// import runBootstrap from './bootstrap/index.js';
import apiRouter from './routes/router.js';

import { connectDB } from '@/config/index.js';
import { errorHandler } from '@/error/index.js';
import { logger } from '@/utils/index.js';

// ------------------------------
// Initialize Express App
// ------------------------------
const app: Application = express();

// ------------------------------
// Body Parsing & Cookies
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------------------
// CORS Setup
// ------------------------------
const allowedOrigins = [
  'https://stockxbd.com',
  'https://www.stockxbd.com',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman (no origin) or whitelisted domains
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.warn(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  })
);

// ------------------------------
// Pretty JSON Responses (Dev Only)
// ------------------------------
if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
}

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

// ------------------------------
// Graceful Shutdown
// ------------------------------
const shutdown = (signal: string) => {
  logger.info(`🛑 ${signal} received. Shutting down...`);
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ------------------------------
// Start Server Function
// ------------------------------
const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    // await runBootstrap();

    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
        logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        logger.info(`🌍 Health check: http://localhost:${PORT}/api/health`);
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    logger.error(`❌ Failed to start server: ${errorMessage}`);
    process.exit(1);
  }
};

startServer();

export default app;
