/**
 * ----------------- Regulator Exports -----------------
 */
export {
  Regulator,
  type IRegulator,
  regulatorController,
  regulatorService,
  regulatorSanitizers,
} from './regulator/index.js';

/**
 * ----------------- Regulator Transaction Exports -----------------
 */
export { regulatorTxController, regulatorTxService } from './regulator-tx/index.js';

/**
 * ----------------- Router Exports -----------------
 */
export { default as regulatorRouter } from './regulator.routes.js';
export { default as regulatorTxRouter } from './regulator.tx.routes.js';
