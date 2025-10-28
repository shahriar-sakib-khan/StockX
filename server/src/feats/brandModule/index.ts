/**
 * ----------------- Local Brand Exports -----------------
 */
export {
  LocalBrand,
  type ILocalBrand,
  localBrandValidator,
  //   localBrandMiddleware,
  localBrandController,
  //   localBrandService,
  localBrandSanitizers,
} from './local-brand/index.js';

/**
 * ----------------- Global Brand Exports -----------------
 */
export {
  GlobalBrand,
  type IGlobalBrand,
  globalBrandValidator,
  //   globalBrandMiddleware,
  globalBrandController,
  globalBrandService,
  globalBrandSanitizers,
} from './global-brand/index.js';

/**
 * ----------------- Router Exports -----------------
 */
export { default as localBrandRouter } from './local.brand.routes.js';
export { default as globalBrandRouter } from './global.brand.routes.js';
