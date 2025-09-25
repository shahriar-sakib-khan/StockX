import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';

import { vehicleTxController, vehicleTxValidator } from './index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle repair, fuel, and transaction routes
 */

/**
 * ----------------- All Vehicle Transactions -----------------
 */

/**
 * @route   GET /stores/:storeId/vehicles-txs
 * @desc    Get all transactions for all vehicles in a store
 * @access  Authenticated
 */
router.get('/vehicle-txs', vehicleTxController.allVehicleTransactions);

/**
 * ----------------- Vehicle Transaction Routes -----------------
 */

/**
 * @route   POST /stores/:storeId/vehicles/:vehicleId/repair
 * @desc    Add a repair record for a vehicle
 * @access  Authenticated
 */
router.post(
  '/vehicles/:vehicleId/repair',
  validateRequest(vehicleTxValidator.repairSchema),
  vehicleTxController.addRepair
);

/**
 * @route   POST /stores/:storeId/vehicles/:vehicleId/fuel
 * @desc    Add a fuel expense for a vehicle
 * @access  Authenticated
 */
router.post(
  '/vehicles/:vehicleId/fuel',
  validateRequest(vehicleTxValidator.fuelSchema),
  vehicleTxController.addFuel
);

/**
 * @route   GET /stores/:storeId/vehicles/:vehicleId/txs
 * @desc    Get all transactions for a vehicle
 * @access  Authenticated
 */
router.get('/vehicles/:vehicleId/txs', vehicleTxController.singleVehicleTransactions);

export default router;
