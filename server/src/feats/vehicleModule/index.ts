/**
 * ----------------- Vehicle Exports -----------------
 */
export {
  Vehicle,
  type IVehicle,
  vehicleController,
  vehicleService,
  vehicleSanitizers,
  vehicleValidator,
} from './vehicle/index.js';

/**
 * ----------------- Transaction Exports -----------------
 */
export {
  vehicleTxConstants,
  vehicleTxController,
  vehicleTxService,
  vehicleTxValidator,
} from './vehicle-tx/index.js';

/**
 * ----------------- Router Exports -----------------
 */
export { default as vehicleRouter } from './vehicle.routes.js';
export { default as vehicleTxRouter } from './vehicle.tx.routes.js';
