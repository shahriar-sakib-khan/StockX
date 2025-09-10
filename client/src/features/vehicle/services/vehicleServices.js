// @ts-check
import API from "@/services/apiClient";

/**
 * Get all vehicles in a specific division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @returns {Promise<import("../types/vehicle").AllVehiclesResponse>} - A promise that resolves to an array of vehicle objects with total count.
 */
export const getVehicles = async (workspaceId, divisionId) =>
    await API.get(`/workspace/${workspaceId}/divisions/${divisionId}/vehicles`);

/**
 * Get details of a single vehicle by ID.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} vehicleId - The ID of the vehicle.
 * @returns {Promise<import("../types/vehicle").SingleVehicleResponse>} - A promise that resolves to a single vehicle object.
 */
export const getSingleVehicle = async (workspaceId, divisionId, vehicleId) =>
    await API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/vehicles/${vehicleId}`,
    );

/**
 * Create a new vehicle in a division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {import("../types/vehicle").NewVehicle} vehicleInfo - The vehicle data to create.
 * @returns {Promise<import("../types/vehicle").CreateVehicleResponse>} A promise that resolves to the created vehicle object.
 */
export const createVehicle = async (workspaceId, divisionId, vehicleInfo) =>
    await API.post(
        `/workspace/${workspaceId}/divisions/${divisionId}/vehicles`,
        vehicleInfo,
    );

/**
 * Update an existing vehicle's information.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} vehicleId - The ID of the vehicle to update.
 * @param {import("../types/vehicle").UpdatedVehicle} vehicleInfo - The new vehicle data.
 * @returns {Promise<import("../types/vehicle").UpdateVehicleResponse>} A promise that resolves to the updated vehicle object.
 */
export const updateVehicleInfo = async (
    workspaceId,
    divisionId,
    vehicleId,
    vehicleInfo,
) =>
    await API.put(
        `/workspace/${workspaceId}/divisions/${divisionId}/vehicles/${vehicleId}`,
        vehicleInfo,
    );

/**
 * Delete a vehicle from a division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} vehicleId - The ID of the vehicle to delete.
 * @returns {Promise<import("../types/vehicle").DeleteVehicleResponse>} A promise that resolves to the deleted vehicle object.
 */
export const deleteVehicle = async (workspaceId, divisionId, vehicleId) =>
    await API.delete(
        `/workspace/${workspaceId}/divisions/${divisionId}/vehicles/${vehicleId}`,
    );

/** ----------------------------------------------------------------------------------------------------------------- */

/**
 * Record a transaction for a vehicle
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} vehicleId - The ID of the vehicle.
 * @param {import("../types/vehicle").VehicleTransactionInput} data - The new transaction data.
 * @returns {Promise<import("../types/vehicle").VehicleTransactionResponse>} - A promise that resolves to the vehicle object and the created transaction.
 */
export const recordVehicleTransaction = async (
    workspaceId,
    divisionId,
    vehicleId,
    data,
) =>
    await API.post(
        `/workspace/${workspaceId}/divisions/${divisionId}/vehicles/${vehicleId}/transactions`,
        data,
    );

/**
 * Get all transactions for a vehicle
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} vehicleId - The ID of the vehicle.
 * @returns {Promise<import("../types/vehicle").AllVehicleTransactionsResponse>} - A promise that resolves to all the previous transactions for given vehicle.
 */
export const getVehicleTransactions = async (
    workspaceId,
    divisionId,
    vehicleId,
) =>
    await API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/vehicles/${vehicleId}/transactions`,
    );
