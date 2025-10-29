import API from "@/services/apiClient";

/**
 * Common function to handle cylinder transactions
 */
const handleCylinderTransaction = async ({
    storeId,
    size,
    regulatorType,
    mode,
    payload,
}) => {
    const data = await API.post(`/stores/${storeId}/cylinders/txs`, payload, {
        params: { size, regulatorType, mode },
    });
    return data;
};

export const buyCylinders = async (args) =>
    handleCylinderTransaction({ ...args, mode: "buy" });

export const sellCylinders = async (args) =>
    handleCylinderTransaction({ ...args, mode: "sell" });
