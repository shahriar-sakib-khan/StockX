import { Router } from 'express';

import authRouter from './auth/router';
import userRouter from './user/router.js';
import paymentRouter from './payment/index.js';
import workspaceRouter from './workspace/router';

import { authenticateUser } from '@/middlewares/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', authenticateUser, userRouter);
router.use('/workspace', authenticateUser, workspaceRouter);
router.use('/payment', paymentRouter);

export default router;
