import { Router } from 'express';

import { authRouter } from '@/feats/userModule/index.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */
const router = Router({ mergeParams: true });

// Authentication routes
router.use('/', authRouter);

export default router;
