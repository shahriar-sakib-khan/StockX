// ------------------------------
// Load Environment Variables and Dependencies
// ------------------------------
import './config/env.config.js';
import 'express-async-errors'; // Catch async errors automatically without try/catch

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

// ------------------------------
// Internal Imports
// ------------------------------
import apiRouter from './routes/router.js';
import { connectDB, cloudinary } from '@/config/index.js';
import { errorHandler } from '@/error/index.js';
import runBootstrap from './bootstrap/index.js';

// ------------------------------
// Multer Configuration (for temporary file handling)
// ------------------------------
// We'll use memory storage for now (since Cloudinary can handle streams)
const upload = multer({ storage: multer.memoryStorage() });

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
      if (!origin) return callback(null, true); // Allow Postman or internal requests

      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn('❌ Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'), false);
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
// Cloudinary Upload Test Endpoint
// ------------------------------
// (You’ll later move this inside brand.routes.ts)
app.post(
  '/api/test-upload',
  upload.single('file'), // Expect field name 'file' in Postman
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Upload buffer directly to Cloudinary
      const uploadResult = cloudinary.uploader.upload_stream(
        { folder: 'brands' }, // You can change the folder name
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return res.status(500).json({ message: 'Upload failed', error });
          }
          return res.status(200).json({
            message: 'Upload successful',
            url: result?.secure_url,
            public_id: result?.public_id,
          });
        }
      );

      // Pipe file buffer to Cloudinary stream
      if (req.file?.buffer) {
        // @ts-ignore
        uploadResult.end(req.file.buffer);
      }
    } catch (err) {
      console.error('Unexpected upload error:', err);
      res.status(500).json({ message: 'Unexpected server error', err });
    }
  }
);

// ------------------------------
// Mount API Routes
// ------------------------------
app.use('/api', apiRouter);

// ------------------------------
// Global Error Handler
// ------------------------------
app.use(errorHandler);

// ------------------------------
// Graceful Shutdown (for production)
// ------------------------------
process.on('SIGINT', async () => {
  console.log('🛑 Gracefully shutting down...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Server terminated...');
  process.exit(0);
});

// ------------------------------
// Start Server Function
// ------------------------------
const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await runBootstrap();

    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`🌍 Health check: http://localhost:${PORT}/api/health`);
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Failed to start server:', errorMessage);
    process.exit(1);
  }
};

startServer();

export default app;
