import API from "@/services/apiClient";

export const exchangeCylinder = async (storeId, data) => {
    const { data: res } = await API.post(
        `/stores/${storeId}/exchange`,
        data,
    );
    return res;
};
