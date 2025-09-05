// @ts-check
import API from "@/services/apiClient";

/** @typedef {import("@/types/vehicle").Vehicle} Vehicle */
/** @typedef {import("@/types/vehicle").NewVehicle} NewVehicle */
/** @typedef {import("@/types/vehicle").UpdatedVehicle} UpdatedVehicle */
/** @typedef {import("@/types/vehicle").AllVehiclesResponse} AllVehiclesResponse */
/** @typedef {import("@/types/vehicle").SingleVehicleResponse} SingleVehicleResponse */
/** @typedef {import("@/types/vehicle").CreateVehicleResponse} CreateVehicleResponse */
/** @typedef {import("@/types/vehicle").UpdateVehicleResponse} UpdateVehicleResponse */
/** @typedef {import("@/types/vehicle").DeleteVehicleResponse} DeleteVehicleResponse */

/**
 * Get all vehicles in a specific division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @returns {Promise<AllVehiclesResponse>} A promise that resolves to an array of vehicle objects with total count.
 */
export const getVehicles = async (workspaceId, divisionId) =>
    await API.get(`/workspace/${workspaceId}/divisions/${divisionId}/vehicles`);

/**
 * Get details of a single vehicle by ID.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} vehicleId - The ID of the vehicle.
 * @returns {Promise<SingleVehicleResponse>} A promise that resolves to the vehicle object.
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
 * @param {NewVehicle} vehicleInfo - The vehicle data to create.
 * @returns {Promise<CreateVehicleResponse>} A promise that resolves to the created vehicle object.
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
 * @param {UpdatedVehicle} vehicleInfo - The new vehicle data.
 * @returns {Promise<UpdateVehicleResponse>} A promise that resolves to the updated vehicle object.
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
 * @returns {Promise<DeleteVehicleResponse>} A promise that resolves to the server response.
 */
export const deleteVehicle = async (workspaceId, divisionId, vehicleId) =>
    await API.delete(
        `/workspace/${workspaceId}/divisions/${divisionId}/vehicles/${vehicleId}`,
    );
