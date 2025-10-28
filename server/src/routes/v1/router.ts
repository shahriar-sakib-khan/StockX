import { Router } from 'express';

import { requireAuth } from '@/middlewares/index.js';

import { default as AuthRouter } from './auth-router/auth.router.js';
import { default as AdminRouter } from './admin-router/admin.router.js';
import { default as UserRouter } from './user-router/user.router.js';
import { default as StoreRouter } from './store-router/store.router.js';

const router = Router();

/**
 * @swagger
 * /api/v1:
 *    description: Entry point for all v1 routes of the API
 *    tags: [API]
 */

router.use('/', AuthRouter);

// Authenticated routes
router.use('/', requireAuth, AdminRouter);
router.use('/', requireAuth, UserRouter);
router.use('/', requireAuth, StoreRouter);

export default router;
