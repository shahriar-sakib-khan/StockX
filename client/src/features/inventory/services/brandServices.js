import API from "@/services/apiClient";

// ================= BRANDS ==================

/**
 * Get all brands (including inactive ones) for a given store.
 * @param {string} storeId - The ID of the store.
 * @returns {Promise<any>} Response containing the full list of brands.
 */
export const getBrands = async (storeId) =>
    API.get(`/stores/${storeId}/brands/a`);

/**
 * Get only active brands for a given store.
 * @param {string} storeId - The ID of the store.
 * @returns {Promise<any>} Response containing the active brands.
 */
export const getActiveBrands = async (storeId) =>
    API.get(`/stores/${storeId}/brands`);

/**
 * Get detailed brand information for a given store.
 * Typically includes extended metadata about each brand.
 * @param {string} storeId - The ID of the store.
 * @returns {Promise<any>} Response containing detailed brand data.
 */
export const getDetailedBrands = async (storeId) =>
    API.get(`/stores/${storeId}/brands/d`);

/**
 * Select (fetch) the active brands for a given store.
 * This is similar to getActiveLocalBrands but can be used
 * where the purpose is explicitly to select brands for a UI.
 * @param {string} storeId - The ID of the store.
 * @returns {Promise<any>} Response containing selected active brands.
 */
export const saveSelectedBrands = async (storeId) =>
    API.get(`/stores/${storeId}/brands`);
