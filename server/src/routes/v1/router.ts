import { Router } from 'express';

import authRouter from './auth/router.js';

import { requireAuth, requireRole } from '@/middlewares/index.js';
import { storeRouter } from '@/feats/routers/index.js';

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

router.use('/auth', authRouter);

// Authenticated routes
router.use('/', requireAuth, storeRouter);

export default router;
