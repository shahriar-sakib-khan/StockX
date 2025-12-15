/**
 * ----------------- Local Brand Exports -----------------
 */
export {
  LocalBrand,
  type ILocalBrand,
  localBrandValidator,
  localBrandController,
  localBrandService,
  localBrandSanitizers,
} from './local-brand/index.js';

/**
 * ----------------- Global Brand Exports -----------------
 */
export {
  GlobalBrand,
  type IGlobalBrand,
  globalBrandValidator,
  globalBrandController,
  globalBrandService,
  globalBrandSanitizers,
} from './global-brand/index.js';

/**
 * ----------------- Router Exports -----------------
 */
export { default as localBrandRouter } from './local.brand.routes.js';
export { default as globalBrandRouter } from './global.brand.routes.js';
