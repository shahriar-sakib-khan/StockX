import { Router } from 'express';

import { shopTxController, shopTxValidator } from './shop-tx/index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Shop Transactions
 */

router.post(
  '/shops/:shopId/clear-due',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(shopTxValidator.shopDueSchema),
  shopTxController.clearShopDue
);

router.post(
  '/shops/exchange',
  storeScope(['owner', 'admin', 'manager', 'driver']),
  validateRequest(shopTxValidator.cylinderExchangeSchema),
  shopTxController.cylinderExchange
);

export default router;
