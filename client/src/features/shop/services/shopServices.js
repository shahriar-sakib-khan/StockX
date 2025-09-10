import API from "@/services/apiClient";

/**
 * Get all shops in a specific division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @returns {Promise<import("../types/shop").AllShopsResponse>} - A promise that resolves to an array of shop objects with total count.
 */
export const getShops = async (workspaceId, divisionId) =>
    await API.get(`/workspace/${workspaceId}/divisions/${divisionId}/stores`);

/**
 * Get details of a single shop by ID.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} shopId - The ID of the shop.
 * @returns {Promise<import("../types/shop").SingleShopResponse>} - A promise that resolves to a single shop object.
 */
export const getSingleShop = async (workspaceId, divisionId, shopId) =>
    await API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/stores/${shopId}`,
    );

/**
 * Create a new shop in a division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {import("../types/shop").NewShop} shopInfo - The shop data to create.
 * @returns {Promise<import("../types/shop").CreateShopResponse>} A promise that resolves to the created shop object.
 */
export const createShop = async (workspaceId, divisionId, shopInfo) =>
    await API.post(
        `/workspace/${workspaceId}/divisions/${divisionId}/stores`,
        shopInfo,
    );

/**
 * Update an existing shop's information.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} shopId - The ID of the shop to update.
 * @param {import("../types/shop").UpdatedShop} shopInfo - The new shop data.
 * @returns {Promise<import("../types/shop").UpdateShopResponse>} A promise that resolves to the updated shop object.
 */
export const updateShopInfo = async (
    workspaceId,
    divisionId,
    shopId,
    shopInfo,
) =>
    await API.put(
        `/workspace/${workspaceId}/divisions/${divisionId}/stores/${shopId}`,
        shopInfo,
    );

/**
 * Delete a shop from a division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} shopId - The ID of the shop to delete.
 * @returns {Promise<import("../types/shop").DeleteShopResponse>} A promise that resolves to the deleted shop object.
 */
export const deleteShop = async (workspaceId, divisionId, shopId) =>
    await API.delete(
        `/workspace/${workspaceId}/divisions/${divisionId}/stores/${shopId}`,
    );
