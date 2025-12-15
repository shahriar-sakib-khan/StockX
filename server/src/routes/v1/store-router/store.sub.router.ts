import { Router } from 'express';

// Feature Modules
import inventoryRouter from './inventory-router';

import localBrandRouter from '@/feats/brandModule/local.brand.routes.js';
import { cylinderRouter } from '@/feats/cylinderModule/index.js';
import inviteRouter from '@/feats/inviteModule/invite.routes.js';
import { invoiceRouter } from '@/feats/invoiceModule/index.js';
import { productRouter } from '@/feats/productModule/index.js';
import { shopRouter, shopTxRouter } from '@/feats/shopModule/index.js';
import { staffRouter } from '@/feats/staffModule/index.js';
import { membershipRouter } from '@/feats/storeModule/index.js';
import { transactionRouter } from '@/feats/transactionModule/index.js';
import { vehicleRouter, vehicleTxRouter } from '@/feats/vehicleModule/index.js';

/**
 * @swagger
 * tags:
 * name: Store
 * description: User store management. Routes under /stores/:storeId.
 */
const router = Router({ mergeParams: true });

/** ----------------- Membership & Staff ----------------- */
router.use('/', inviteRouter);
router.use('/', membershipRouter);
router.use('/', staffRouter);

/** ----------------- Assets & Inventory ----------------- */
router.use('/', localBrandRouter);
router.use('/', cylinderRouter);
router.use('/', productRouter);

/** ----------------- Logistics ----------------- */
router.use('/', vehicleRouter);
router.use('/', vehicleTxRouter);

/** ----------------- Sales & Finance ----------------- */
router.use('/', invoiceRouter);
router.use('/', inventoryRouter);
router.use('/', transactionRouter);

/** ----------------- CRM ----------------- */
router.use('/', shopRouter);
router.use('/', shopTxRouter);

export default router;
