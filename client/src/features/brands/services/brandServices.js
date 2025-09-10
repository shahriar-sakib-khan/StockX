// @ts-check
import API from "@/services/apiClient";

/**
 * Get all brands in a division (basic list view).
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @returns {Promise<import("../types/brands").BrandsResponse>} A promise that resolves to an array of brand objects with total count.
 */
export const getBrands = async (workspaceId, divisionId) =>
    API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/all-brands`,
    );

/**
 * Get all brands in a division with detailed information.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @returns {Promise<import("../types/brands").DetailedBrandsResponse>} A promise that resolves to an array of detailed brand objects with total count.
 */
export const getDetailedBrands = async (workspaceId, divisionId) =>
    API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/all-brands/d`,
    );

/**
 * Save or select brands in a division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {import("../types/brands").SelectedBrand[]} brands - Array of brand objects to save or select (only id and isActive).
 * @returns {Promise<import("../types/brands").SaveBrandsResponse>} A promise that resolves to the server response.
 */
export const saveSelectedBrands = async (workspaceId, divisionId, brands) =>
    API.patch(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/brands`,
        brands,
    );

/**
 * Get all cylinders in a division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @returns {Promise<Object[]>} A promise that resolves to an array of cylinder objects.
 */
// export const getCylinders = async (workspaceId, divisionId) =>
//     API.get(`/workspace/${workspaceId}/divisions/${divisionId}/inventory/cylinders`);
