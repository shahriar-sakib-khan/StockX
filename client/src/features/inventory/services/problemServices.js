import API from "@/services/apiClient";

const markDefected = async ({ storeId, size, regulatorType, payload }) => {
    const data = await API.post(
        `/stores/${storeId}/cylinders/mark-defected`,
        payload,
        { params: { size, regulatorType } },
    );
    return data;
};

const unmarkDefected = async ({ storeId, size, regulatorType, payload }) => {
    const data = await API.post(
        `/stores/${storeId}/cylinders/unmark-defected`,
        payload,
        { params: { size, regulatorType } },
    );
    return data;
};

export { markDefected, unmarkDefected };
