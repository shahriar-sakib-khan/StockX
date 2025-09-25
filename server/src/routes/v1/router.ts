import { Router } from 'express';

import { requireAuth } from '@/middlewares/index.js';

import { default as AuthRouter } from './auth.router.js';
import { default as UserRouter } from './user.router.js';
import { default as StoreRouter } from './store-routers/store.router.js';

const router = Router();

/**
 * @swagger
 * /api/v1:
 *    description: Entry point for all v1 routes of the API
 *    tags: [API]
 */

router.use('/', AuthRouter);

// Authenticated routes
router.use('/', requireAuth, UserRouter);
router.use('/', requireAuth, StoreRouter);

export default router;
