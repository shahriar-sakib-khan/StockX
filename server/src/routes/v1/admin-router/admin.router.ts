import { Router } from 'express';

import { globalBrandRouter } from '@/feats/brandModule';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */
const router = Router({ mergeParams: true });

// Authentication routes
router.use('/admin', globalBrandRouter);

export default router;
