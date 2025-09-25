/**
 * @module vehicle.validation
 *
 * @description
 * Zod validation schemas for vehicle operations.
 * Handles creating and updating vehicle details.
 */

import { z } from 'zod';

/**
 * ----------------- Create Vehicle Schema -----------------
 * @property {string} regNumber - Required. Unique vehicle registration number.
 * @property {string} [vehicleBrand] - Optional. Brand of the vehicle.
 * @property {string} [vehicleModel] - Optional. Model of the vehicle.
 * @property {string} [image] - Optional. Vehicle image URL.
 */
export const createVehicleSchema = z
  .object({
    regNumber: z.string().trim().min(1, { message: 'Registration number is required' }),
    vehicleBrand: z.string().trim().optional(),
    vehicleModel: z.string().trim().optional(),
    image: z.string().trim().optional(),
  })
  .strict();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

/**
 * ----------------- Update Vehicle Schema -----------------
 * @description
 * Allows partial updates of vehicle details.
 */
export const updateVehicleSchema = createVehicleSchema.partial();
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
