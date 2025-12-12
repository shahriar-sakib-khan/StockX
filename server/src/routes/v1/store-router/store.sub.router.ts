import { Router } from 'express';

import localBrandRouter from '@/feats/brandModule/local.brand.routes.js';
import { cylinderRouter, cylinderTxRouter } from '@/feats/cylinderModule/index.js';
import { exchangeRouter } from '@/feats/exchangeModule/index.js';
import inviteRouter from '@/feats/inviteModule/invite.routes.js';
import { regulatorRouter, regulatorTxRouter } from '@/feats/regulatorModule/index.js';
import { shopRouter, shopTxRouter } from '@/feats/shopModule/index.js';
import { staffRouter } from '@/feats/staffModule/index.js';
import { membershipRouter } from '@/feats/storeModule/index.js';
import { stoveRouter, stoveTxRouter } from '@/feats/stoveModule/index.js';
import { transactionRouter } from '@/feats/transactionModule/index.js';
import { vehicleRouter, vehicleTxRouter } from '@/feats/vehicleModule/index.js';

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: User store management. Routes under /stores/:storeId.
 */
const router = Router({ mergeParams: true });

/** ----------------- Invite routes ----------------- */
router.use('/', inviteRouter);

/** ----------------- Membership routes ----------------- */
router.use('/', membershipRouter);

/** ----------------- Local brand routes ----------------- */
router.use('/', localBrandRouter);

/** ----------------- Vehicle routes ----------------- */
router.use('/', vehicleRouter);
router.use('/', vehicleTxRouter);

/** ----------------- Store routes ----------------- */
router.use('/', shopRouter);
router.use('/', shopTxRouter);

/** ----------------- Cylinder routes ----------------- */
router.use('/', cylinderRouter);
router.use('/', cylinderTxRouter);

/** ----------------- Regulator routes ----------------- */
router.use('/', regulatorRouter);
router.use('/', regulatorTxRouter);

/** ----------------- Stove routes ----------------- */
router.use('/', stoveRouter);
router.use('/', stoveTxRouter);

/** ----------------- Transaction routes ----------------- */
router.use('/', transactionRouter);

/** ----------------- Exchange routes ----------------- */
router.use('/', exchangeRouter);

/** ----------------- Staff routes ----------------- */
router.use('/', staffRouter);

export default router;
