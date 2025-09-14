import { Router } from 'express';

import authRouter from './auth/router.js';
import adminRouter from './admin/router.js';
import userRouter from './user/router.js';
import paymentRouter from './payment/index.js';
import workspaceRouter from './workspace/router.js';

import { requireAuth, requireRole } from '@/middlewares/index.js';

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
router.use('/user', requireAuth, userRouter);
router.use('/admin', requireAuth, requireRole('ostad'), adminRouter);
router.use('/workspace', requireAuth, workspaceRouter);
router.use('/payment', paymentRouter);

export default router;
