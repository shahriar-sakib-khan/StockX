import API from "@/services/apiClient";

/**
 * Fetch all brands for a store
 */
export const getBrands = async (storeId, mode = "all") => {
    const { data } = await API.get(`/stores/${storeId}/brands`, {
        params: { mode, page: 1, limit: 20 },
    });
    return data || [];
};

/**
 * Update brand selection state
 */
export const updateBrands = async (storeId, payload) => {
    const { data } = await API.patch(
        `/stores/${storeId}/brands/select`,
        payload,
    );
    return data;
};
