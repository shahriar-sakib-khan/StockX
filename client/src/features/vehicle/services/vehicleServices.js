// @ts-check
import API from "@/services/apiClient";

/**
 * Get all vehicles in a store.
 * @param {string} storeId
 * @returns {Promise<import("../types/vehicle").AllVehiclesResponse>}
 */
export const getVehicles = async (storeId) =>
    API.get(`/stores/${storeId}/vehicles`);

/**
 * Get details of a single vehicle by ID.
 * @param {string} storeId
 * @param {string} vehicleId
 * @returns {Promise<import("../types/vehicle").SingleVehicleResponse>}
 */
export const getSingleVehicle = async (storeId, vehicleId) =>
    API.get(`/stores/${storeId}/vehicles/${vehicleId}`);

/**
 * Create a new vehicle in a store.
 * @param {string} storeId
 * @param {import("../types/vehicle").NewVehicle} vehicleInfo
 * @returns {Promise<import("../types/vehicle").CreateVehicleResponse>}
 */
export const createVehicle = async (storeId, vehicleInfo) =>
    API.post(`/stores/${storeId}/vehicles`, vehicleInfo);

/**
 * Update an existing vehicle’s information.
 * @param {string} storeId
 * @param {string} vehicleId
 * @param {import("../types/vehicle").UpdatedVehicle} vehicleInfo
 * @returns {Promise<import("../types/vehicle").UpdateVehicleResponse>}
 */
export const updateVehicleInfo = async (storeId, vehicleId, vehicleInfo) =>
    API.patch(`/stores/${storeId}/vehicles/${vehicleId}`, vehicleInfo);

/**
 * Delete a vehicle from a store.
 * @param {string} storeId
 * @param {string} vehicleId
 * @returns {Promise<import("../types/vehicle").DeleteVehicleResponse>}
 */
export const deleteVehicle = async (storeId, vehicleId) =>
    API.delete(`/stores/${storeId}/vehicles/${vehicleId}`);

/* ---------------- Transactions ---------------- */

/**
 * Record a repair transaction for a vehicle.
 * @param {string} storeId
 * @param {string} vehicleId
 * @param {import("../types/vehicle").VehicleTransactionInput} data
 * @returns {Promise<import("../types/vehicle").VehicleTransactionResponse>}
 */
export const repairVehicle = async (storeId, vehicleId, data) =>
    API.post(`/stores/${storeId}/vehicles/${vehicleId}/repair`, data);

/**
 * Record a fuel transaction for a vehicle.
 * @param {string} storeId
 * @param {string} vehicleId
 * @param {import("../types/vehicle").VehicleTransactionInput} data
 * @returns {Promise<import("../types/vehicle").VehicleTransactionResponse>}
 */
export const fuelVehicle = async (storeId, vehicleId, data) =>
    API.post(`/stores/${storeId}/vehicles/${vehicleId}/fuel`, data);

/**
 * Get all transactions for a single vehicle.
 * @param {string} storeId
 * @param {string} vehicleId
 * @returns {Promise<import("../types/vehicle").AllVehicleTransactionsResponse>}
 */
export const getVehicleTransactions = async (storeId, vehicleId) =>
    API.get(`/stores/${storeId}/vehicles/${vehicleId}/txs`);

/**
 * Get all transactions across all vehicles in a store.
 * @param {string} storeId
 * @returns {Promise<import("../types/vehicle").AllVehicleTransactionsResponse>}
 */
export const getAllVehicleTransactions = async (storeId) =>
    API.get(`/stores/${storeId}/vehicle-txs`);
