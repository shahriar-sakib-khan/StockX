import { Router } from 'express';

import { requireAuth } from '@/middlewares';

import { storeRouter } from '@/feats/storeModule/index.js';
import { authRouter, userRouter } from '@/feats/userModule/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and session management
 *   - name: Admin
 *     description: Admin (ostad) routes
 *   - name: User
 *     description: User profile and account management
 *   - name: Workspace
 *     description: Workspace creation and tenant operations
 *   - name: Payment
 *     description: Payment and billing routes
 */

router.use('/', authRouter);

// Authenticated routes
router.use('/', requireAuth, userRouter);
router.use('/', requireAuth, storeRouter);

export default router;
