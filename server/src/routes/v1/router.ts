import { Router } from 'express';

import { requireAuth } from '@/middlewares';

import { storeRouter } from '@/feats/storeModule/index.js';
import { authRouter, userRouter } from '@/feats/userModule/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: API
 *   description: API entry point for all versioned routes
 */

router.use('/', authRouter);

// Authenticated routes
router.use('/', requireAuth, userRouter);
router.use('/', requireAuth, storeRouter);

export default router;
