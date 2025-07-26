import { Router } from 'express';

import authRouter from './auth/router';
import userRouter from './user/router';
import paymentRouter from './payment';
import workspaceRouter from './workspace/router';

import { authenticateUser } from '@/middlewares';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and session management
 *   - name: User
 *     description: User profile and account management
 *   - name: Workspace
 *     description: Workspace creation and tenant operations
 *   - name: Payment
 *     description: Payment and billing routes
 */

router.use('/auth', authRouter);

// Authenticated routes
router.use('/user', authenticateUser, userRouter);
router.use('/workspace', authenticateUser, workspaceRouter);
router.use('/payment', paymentRouter);

export default router;
