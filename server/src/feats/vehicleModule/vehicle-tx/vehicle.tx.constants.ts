/**
 * @module vehicleTx.constants
 *
 * @description
 * Constants for vehicle transaction operations.
 * These constants are used to define the structure and types of transactions in the vehicle transaction module.
 */

/**
 * ----------------- Transaction Categories -----------------
 */
export const VehicleTxCategory = {
  VEHICLE_FUEL_PAYMENT: 'fuel_payment', // fuel for vehicles
  VEHICLE_REPAIR_PAYMENT: 'repair_payment', // vehicle repair/maintenance
} as const;

export type VehicleTxCategoryType = (typeof VehicleTxCategory)[keyof typeof VehicleTxCategory];

/**
 * ----------------- Payment Methods -----------------
 */
export const VehiclePaymentMethod = {
  CASH: 'cash',
  BANK: 'bank',
  MOBILE: 'mobile',
  DUE: 'due',
  OTHER: 'other',
} as const;

export type VehiclePaymentMethodType =
  (typeof VehiclePaymentMethod)[keyof typeof VehiclePaymentMethod];

/**
 * ----------------- Counterparty Kind -----------------
 */
export const VehicleCounterpartyKind = {
  VEHICLE: 'vehicle',
} as const;

export type VehicleCounterpartyKindType =
  (typeof VehicleCounterpartyKind)[keyof typeof VehicleCounterpartyKind];
