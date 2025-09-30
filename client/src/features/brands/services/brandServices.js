// @ts-check
import API from "@/services/apiClient";

/** @typedef {import("@/features/brands/types/brands").SelectedBrand} SelectedBrand */

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
 * Save (select) specific brands for a store.
 * @param {string} storeId
 * @param {{id: string, isActive: boolean}[]} brands
 */
export const saveSelectedBrands = async (storeId, brands) => {
    if (!storeId) throw new Error("storeId is required");
    return API.patch(`/stores/${storeId}/brands`, brands);
};
