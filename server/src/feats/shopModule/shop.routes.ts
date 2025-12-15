import { Router } from 'express';

import { shopValidator, shopController } from './shop/index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Shop
 */

router.post(
  '/shops',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(shopValidator.createShopSchema),
  shopController.createShop
);

router.get('/shops', storeScope([]), shopController.getAllShops);
router.get('/shops/:shopId', storeScope([]), shopController.getSingleShop);

router.patch(
  '/shops/:shopId',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(shopValidator.updateShopSchema),
  shopController.updateShop
);

router.delete('/shops/:shopId', storeScope(['owner', 'admin']), shopController.deleteShop);

export default router;
