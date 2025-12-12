import { Router } from 'express';

import { userInviteRouter } from '@/feats/inviteModule/index.js';
import { requireRole, userRouter } from '@/feats/userModule/index.js';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User account management
 */
const router = Router({ mergeParams: true });

// General user routes
router.use('/', userRouter);

/**
 * ----------------- User sub-router (User Scoped) -----------------
 */
router.use('/users', requireRole('user'));

// User invite routes
router.use('/users', userInviteRouter);

export default router;
