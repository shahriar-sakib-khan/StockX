import { Router } from 'express';

import { vehicleTxController, vehicleTxValidator } from './vehicle-tx/index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Vehicle Transactions
 * description: Fuel and Repair logging
 */

/**
 * @route   POST /stores/:storeId/vehicles/:vehicleId/fuel
 * @desc    Log a fuel expense
 * @access  Private (Owner, Admin, Manager, Driver)
 */
router.post(
  '/vehicles/:vehicleId/fuel',
  storeScope(['owner', 'admin', 'manager', 'driver']),
  validateRequest(vehicleTxValidator.vehicleTxSchema),
  vehicleTxController.addFuel
);

/**
 * @route   POST /stores/:storeId/vehicles/:vehicleId/repair
 * @desc    Log a repair expense
 * @access  Private (Owner, Admin, Manager)
 */
router.post(
  '/vehicles/:vehicleId/repair',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(vehicleTxValidator.vehicleTxSchema),
  vehicleTxController.addRepair
);

export default router;
