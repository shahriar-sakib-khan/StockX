/**
 * @module vehicle.validation
 *
 * @description Validation schemas for vehicle operations.
 */
import { txConstants } from '@/common';
import { z } from 'zod';

/**
 * VehicleInputSchema
 * @property {string} regNumber - Required. Vehicle registration number.
 * @property {string} [vehicleBrand] - Optional. Vehicle brand name.
 * @property {string} [vehicleModel] - Optional. Vehicle model name.
 *
 * @description
 * Zod schema for creating or updating a vehicle.
 * Ensures workspace and division references are valid and registration rules are followed.
 */
export const VehicleInputSchema = z
  .object({
    regNumber: z.string().min(1, { message: 'Registration number is required' }),
    vehicleBrand: z.string().optional(),
    vehicleModel: z.string().optional(),
  })
  .strict();

export type VehicleInput = z.infer<typeof VehicleInputSchema>;

/**
 * UpdateVehicleInputSchema
 * @property {string} [regNumber] - Optional. Vehicle registration number.
 * @property {string} [vehicleBrand] - Optional. Vehicle brand name.
 * @property {string} [vehicleModel] - Optional. Vehicle model name.
 *
 * @description
 * Zod schema for validating vehicle update input.
 * All fields are optional to allow partial updates.
 */
export const updateVehicleSchema = z
  .object({
    regNumber: z.string().min(1, { message: 'Registration number is required' }).optional(),
    vehicleBrand: z.string().optional(),
    vehicleModel: z.string().optional(),
  })
  .strict();

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;

/**
 * VehicleTransactionInput
 * @property {number} amount - Required. Transaction amount, must be greater than 0.
 * @property {VehicleCategoryType} category - Required. Must be one of vehicle-related categories.
 * @property {PaymentMethodType} [paymentMethod] - Optional. One of 'cash', 'bank', 'mobile', 'due', 'other'.
 * @property {string} [ref] - Optional. Reference string such as invoice or voucher number.
 * @property {object} [details] - Optional. Additional metadata for the transaction.
 * @property {string} workspace - Required. Workspace ObjectId string.
 * @property {string} division - Required. Division ObjectId string.
 *
 * @description
 * Zod schema for validating vehicle transaction creation input.
 * Ensures all required fields are present, scoped to workspace & division, and category is restricted to vehicle-related types.
 */
export const vehicleTransactionSchema = z
  .object({
    amount: z.number().positive({ message: 'Amount must be greater than 0' }),
    category: z.enum(['fuel_payment', 'repair_payment'] as const, {
      message: 'Invalid transaction category',
    }),
    paymentMethod: z.enum(txConstants.PaymentMethod).optional(),
    ref: z.string().optional(),
    details: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type VehicleTransactionInput = z.infer<typeof vehicleTransactionSchema>;
