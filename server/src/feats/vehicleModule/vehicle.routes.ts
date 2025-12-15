import { Router } from 'express';

import { cargoController, cargoValidator } from './cargo/index.js';
import { vehicleValidator, vehicleController } from './vehicle/index.js';

import { storeScope } from '@/feats/storeModule/index.js';
import { validateRequest } from '@/middlewares/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Vehicle
 */

// --- CRUD ---
/**
 * @route   POST /stores/:storeId/vehicles
 * @desc    Create a new vehicle under a store
 * @access  Private (Owner, Admin, Manager)
 */
router.post(
  '/vehicles',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(vehicleValidator.createVehicleSchema),
  vehicleController.createVehicle
);

/**
 * @route   GET /stores/:storeId/vehicles
 * @desc    Get all vehicles for a store
 * @access  Private (All Members)
 */
router.get('/vehicles', storeScope([]), vehicleController.getAllVehicles);

/**
 * @route   GET /stores/:storeId/vehicles/:vehicleId
 * @desc    Get a single vehicle by ID
 * @access  Private (All Members)
 */
router.get('/vehicles/:vehicleId', storeScope([]), vehicleController.getSingleVehicle);

/**
 * @route   PATCH /stores/:storeId/vehicles/:vehicleId
 * @desc    Update a vehicle's information
 * @access  Private (Owner, Admin, Manager)
 */
router.patch(
  '/vehicles/:vehicleId',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(vehicleValidator.updateVehicleSchema),
  vehicleController.updateVehicle
);

/**
 * @route   DELETE /stores/:storeId/vehicles/:vehicleId
 * @desc    Delete a vehicle
 * @access  Private (Owner, Admin)
 */
router.delete(
  '/vehicles/:vehicleId',
  storeScope(['owner', 'admin']),
  vehicleController.deleteVehicle
);

// --- LOGISTICS (CARGO) ---
/**
 * @route POST /stores/:storeId/vehicles/:vehicleId/load
 * @desc Load stock onto vehicle (Store -> Vehicle)
 */
router.post(
  '/vehicles/:vehicleId/load',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(cargoValidator.cargoOperationSchema),
  cargoController.loadVehicle
);

/**
 * @route POST /stores/:storeId/vehicles/:vehicleId/unload
 * @desc Unload stock from vehicle (Vehicle -> Store)
 */
router.post(
  '/vehicles/:vehicleId/unload',
  storeScope(['owner', 'admin', 'manager']),
  validateRequest(cargoValidator.cargoOperationSchema),
  cargoController.unloadVehicle
);

export default router;
