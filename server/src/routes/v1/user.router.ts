import { Router } from 'express';

import { requireRole, userRouter } from '@/feats/userModule/index.js';
import { userInviteRouter } from '@/feats/inviteModule/index.js';

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
router.use('/user', requireRole('user'));

// User invite routes
router.use('/', userInviteRouter);

export default router;
