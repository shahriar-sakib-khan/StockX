import API from "@/services/apiClient";

/**
 * Generic API handler for marking/unmarking defected products.
 */
export const markDefected = async ({
    type,
    storeId,
    size,
    regulatorType,
    burnerCount,
    doMark,
    payload,
}) => {
    const endpointMap = {
        cylinders: `/stores/${storeId}/cylinders/mark`,
        regulators: `/stores/${storeId}/regulators/mark`,
        stoves: `/stores/${storeId}/stoves/mark`,
    };

    const params = { doMark };

    if (type === "cylinders") Object.assign(params, { size, regulatorType });
    if (type === "stoves") Object.assign(params, { burnerCount });
    if (type === "regulators") Object.assign(params, { regulatorType });

    const data = await API.patch(endpointMap[type], payload, { params });
    return data;
};
