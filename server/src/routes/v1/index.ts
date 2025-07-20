import { Router } from 'express';

import authRouter from './auth/router.js';
import userRouter from './user/index.js';
import paymentRouter from './payment/index.js';

import { authenticateUser } from '@/middlewares/index.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', authenticateUser, userRouter);
router.use('/payment', paymentRouter);

export default router;
