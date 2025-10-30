import API from "@/services/apiClient";

/**
 * Update cylinder price.
 */
export const updateCylinderPrice = async ({
    storeId,
    size,
    regulatorType,
    payload,
}) => {
    const data = await API.patch(
        `/stores/${storeId}/cylinders/price`,
        payload,
        { params: { size, regulatorType } },
    );
    return data;
};
