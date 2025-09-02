/**
 * @module vehicle.validation
 *
 * @description Validation schemas for vehicle operations.
 */
import { z } from 'zod';

/**
 * VehicleInputSchema
 * @property {string} regNumber - Required. Vehicle registration number.
 * @property {string} [brand] - Optional. Vehicle brand name.
 * @property {string} [vehicleModel] - Optional. Vehicle model name.
 *
 * @description
 * Zod schema for creating or updating a vehicle.
 * Ensures workspace and division references are valid and registration rules are followed.
 */
export const VehicleInputSchema = z
  .object({
    regNumber: z.string().min(1, { message: 'Registration number is required' }),
    brand: z.string().optional(),
    vehicleModel: z.string().optional(),
  })
  .strict();

export type VehicleInput = z.infer<typeof VehicleInputSchema>;

/**
 * UpdateVehicleInputSchema
 * @property {string} [regNumber] - Optional. Vehicle registration number.
 * @property {string} [brand] - Optional. Vehicle brand name.
 * @property {string} [vehicleModel] - Optional. Vehicle model name.
 *
 * @description
 * Zod schema for validating vehicle update input.
 * All fields are optional to allow partial updates.
 */
export const updateVehicleSchema = z
  .object({
    regNumber: z.string().min(1, { message: 'Registration number is required' }).optional(),
    brand: z.string().optional(),
    vehicleModel: z.string().optional(),
  })
  .strict();

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
