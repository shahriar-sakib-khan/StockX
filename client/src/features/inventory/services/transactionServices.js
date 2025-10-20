import API from "@/services/apiClient";

const buyCylinders = async ({ storeId, size, regulatorType, payload }) => {
    const data = await API.post(
        `/stores/${storeId}/cylinders/buy`,
        payload,
        { params: { size, regulatorType } },
    );
    return data;
};

const sellCylinders = async ({ storeId, size, regulatorType, payload }) => {
    const data = await API.post(
        `/stores/${storeId}/cylinders/sell`,
        payload,
        { params: { size, regulatorType } },
    );
    return data;
};

export { buyCylinders, sellCylinders };
