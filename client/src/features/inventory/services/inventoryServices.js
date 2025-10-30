import API from "@/services/apiClient";

/**
 * Fetch cylinder inventory for a store
 * @param {string} storeId - The ID of the store.
 * @param {number} size - The size of the cylinder.
 * @param {string} regulatorType - The type of the regulator.
 * @returns {Promise<any>} Response containing the cylinder inventory.
 */
export const getCylinderInventory = async ({
    storeId,
    size,
    regulatorType,
}) => {
    const { data } = await API.get(`/stores/${storeId}/cylinders/inventory`, {
        params: { size, regulatorType },
    });

    return data || [];
};

/**
 * Fetch stove inventory for a store
 */
export const getStoveInventory = async ({ storeId }) => {
    const data = await API.get(`/stores/${storeId}/stoves/inventory`);
    return data;
};

/**
 * Fetch regulator inventory for a store
 */
export const getRegulatorInventory = async ({ storeId }) => {
    const { data } = await API.get(`/stores/${storeId}/regulators/inventory`);
    return data;
};
