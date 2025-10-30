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

/**
 * Common function to handle regulator transactions
 */
const handleRegulatorTransaction = async ({
    storeId,
    regulatorType,
    mode,
    payload,
}) => {
    const data = await API.post(`/stores/${storeId}/regulators/txs`, payload, {
        params: { regulatorType, mode },
    });
    return data;
};

export const buyRegulators = async (args) =>
    handleRegulatorTransaction({ ...args, mode: "buy" });

export const sellRegulators = async (args) =>
    handleRegulatorTransaction({ ...args, mode: "sell" });

/**
 * Common function to handle stove transactions
 */
const handleStoveTransaction = async ({
    storeId,
    burnerCount,
    mode,
    payload,
}) => {
    const data = await API.post(`/stores/${storeId}/stoves/txs`, payload, {
        params: { burnerCount, mode },
    });
    return data;
};

export const buyStoves = async (args) =>
    handleStoveTransaction({ ...args, mode: "buy" });

export const sellStoves = async (args) =>
    handleStoveTransaction({ ...args, mode: "sell" });
