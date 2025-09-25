import { Router } from 'express';

import { validateRequest } from '@/middlewares/index.js';

import { vehicleValidator, vehicleController } from './vehicle/index.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle management routes
 */

/**
 * ----------------- Vehicle CRUD Routes -----------------
 */

/**
 * @route   POST /stores/:storeId/vehicles
 * @desc    Create a new vehicle under a store
 * @access  Private
 */
router.post(
  '/vehicles',
  validateRequest(vehicleValidator.createVehicleSchema),
  vehicleController.createVehicle
);

/**
 * @route   GET /stores/:storeId/vehicles
 * @desc    Get all vehicles for a store
 * @access  Private
 */
router.get('/vehicles', vehicleController.getAllVehicles);

/**
 * @route   GET /stores/:storeId/vehicles/:vehicleId
 * @desc    Get a single vehicle by ID
 * @access  Private
 */
router.get('/vehicles/:vehicleId', vehicleController.getSingleVehicle);

/**
 * @route   PATCH /stores/:storeId/vehicles/:vehicleId
 * @desc    Update a vehicle's information
 * @access  Private
 */
router.patch(
  '/vehicles/:vehicleId',
  validateRequest(vehicleValidator.updateVehicleSchema),
  vehicleController.updateVehicle
);

/**
 * @route   DELETE /stores/:storeId/vehicles/:vehicleId
 * @desc    Delete a vehicle
 * @access  Private
 */
router.delete('/vehicles/:vehicleId', vehicleController.deleteVehicle);

export default router;
