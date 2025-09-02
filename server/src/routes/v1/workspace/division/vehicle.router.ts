import { Router } from 'express';

import { validateRequest, workspaceScope, divisionScope } from '@/middlewares';
import { vehicleController } from '@/controllers/v1';
import { vehicle } from '@/validations';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle management within workspace divisions
 */

/**
 * ----------------- Vehicle CRUD -----------------
 */

/**
 * @route   POST /:workspaceId/divisions/:divisionId/vehicles
 * @desc    Create a new vehicle in a division
 * @access  Admin (division)
 */
router.post(
  '/',
  divisionScope(['division_admin']),
  validateRequest(vehicle.VehicleInputSchema),
  vehicleController.createVehicle
);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/vehicles
 * @desc    Get all vehicles in a division
 * @access  Authenticated
 */
router.get('/', vehicleController.getAllVehicles);

/**
 * @route   GET /:workspaceId/divisions/:divisionId/vehicles/:vehicleId
 * @desc    Get a single vehicle by ID
 * @access  Authenticated
 */
router.get('/:vehicleId', vehicleController.getSingleVehicle);

/**
 * @route   PUT /:workspaceId/divisions/:divisionId/vehicles/:vehicleId
 * @desc    Update vehicle details
 * @access  Admin (division)
 */
router.put(
  '/:vehicleId',
  divisionScope(['division_admin']),
  validateRequest(vehicle.updateVehicleSchema),
  vehicleController.updateVehicle
);

/**
 * @route   DELETE /:workspaceId/divisions/:divisionId/vehicles/:vehicleId
 * @desc    Delete a vehicle
 * @access  Admin (division)
 */
router.delete('/:vehicleId', divisionScope(['division_admin']), vehicleController.deleteVehicle);

export default router;
