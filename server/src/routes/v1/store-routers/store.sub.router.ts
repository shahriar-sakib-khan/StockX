import { Router } from 'express';

import inviteRouter from '@/feats/inviteModule/invite.routes.js';
import localBrandRouter from '@/feats/brandModule/local.brand.routes.js';
import { cylinderRouter, cylinderTxRouter } from '@/feats/cylinderModule/index.js';
import { vehicleRouter, vehicleTxRouter } from '@/feats/vehicleModule/index.js';
import { transactionRouter } from '@/feats/transactionModule/index.js';

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: User store management. Routes under /stores/:storeId.
 */
const router = Router({ mergeParams: true });

/** ----------------- Invite routes ----------------- */
router.use('/', inviteRouter);

/** ----------------- Local brand routes ----------------- */
router.use('/', localBrandRouter);

/** ----------------- Cylinder routes ----------------- */
router.use('/', cylinderRouter);
router.use('/', cylinderTxRouter);

/** ----------------- Vehicle routes ----------------- */
router.use('/', vehicleRouter);
router.use('/', vehicleTxRouter);

/** ----------------- Transaction routes ----------------- */
router.use('/', transactionRouter);

export default router;
