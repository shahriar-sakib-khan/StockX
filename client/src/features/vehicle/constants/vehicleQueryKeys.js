// @ts-check

/**
 * Vehicle query keys used in react-query
 * @typedef {"vehicles" | "vehicle" | "vehicle_transaction" | "vehicle_transactions"} VehicleQueryKey
 */

/** Single vehicle */
export const VEHICLE = /** @type {VehicleQueryKey} */ ("vehicle");

/** All vehicles in a store */
export const VEHICLES = /** @type {VehicleQueryKey} */ ("vehicles");

/** Transactions for a single vehicle */
export const VEHICLE_TRANSACTION = /** @type {VehicleQueryKey} */ ("vehicle_transaction");

/** All transactions across all vehicles in a store */
export const VEHICLE_TRANSACTIONS = /** @type {VehicleQueryKey} */ ("vehicle_transactions");
