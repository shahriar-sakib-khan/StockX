import { Router } from 'express';

import { storeRouter, storeScope } from '@/feats/storeModule/index.js';

import { default as StoreSubRouter } from './store.sub.router.js';
/**
 * @swagger
 * tags:
 *   name: Store
 *   description: User store management. Routes under /stores/:storeId.
 */
const router = Router({ mergeParams: true });

/**
 * ----------------- General Store routes -----------------
 */
router.use('/', storeRouter);

/**
 * ----------------- Store sub-routers (Store Scope) -----------------
 */
router.use('/stores/:storeId', storeScope(), StoreSubRouter);

export default router;
