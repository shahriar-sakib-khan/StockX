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
    const data = await API.get(`/stores/${storeId}/cylinder-inventory`, {
        params: { size, regulatorType },
    });
    return data;
};

/**
 * Fetch stove inventory for a store
 */
export const getStoveInventory = async ({ storeId }) => {
    const data = await API.get(`/stores/${storeId}/stove-inventory`);
    return data;
};

/**
 * Fetch regulator inventory for a store
 */
export const getRegulatorInventory = async ({ storeId }) => {
    const data = await API.get(`/stores/${storeId}/regulator-inventory`);
    return data;
};


import axios from "axios";
/**
 * Mark cylinders as defected
 */
export const markDefected = async ({ storeId, size, regulatorType, payload }) => {
  const { data } = await axios.patch(
    `${API}/stores/${storeId}/cylinders/mark-defected`,
    payload,
    { params: { size, regulatorType } }
  );
  return data;
};

/**
 * Unmark cylinders as defected
 */
export const unmarkDefected = async ({ storeId, size, regulatorType, payload }) => {
  const { data } = await axios.patch(
    `${API}/stores/${storeId}/cylinders/unmark-defected`,
    payload,
    { params: { size, regulatorType } }
  );
  return data;
};
