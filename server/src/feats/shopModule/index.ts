/**
 * ----------------- Shop Exports -----------------
 */
export {
  Shop,
  type IShop,
  shopValidator,
  shopController,
  shopService,
  shopSanitizers,
} from './shop/index.js';

/**
 * ----------------- Shop Transaction Exports -----------------
 */
export { shopTxController, shopTxService } from './shop-tx/index.js';

/**
 * ----------------- Router Exports -----------------
 */
export { default as shopRouter } from './shop.routes.js';
export { default as shopTxRouter } from './shop.tx.routes.js';
