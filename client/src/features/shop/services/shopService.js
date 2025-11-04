import API from "@/services/apiClient";

export const getAllShops = async (storeId) =>
    API.get(`/stores/${storeId}/shops`);

export const getSingleShop = async (storeId, shopId) =>
    API.get(`/stores/${storeId}/shops/${shopId}`);

export const createShop = async (storeId, shopInfo) =>
    API.post(`/stores/${storeId}/shops`, shopInfo);

export const updateShop = async (storeId, shopId, shopInfo) =>
    API.patch(`/stores/${storeId}/shops/${shopId}`, shopInfo);

export const deleteShop = async (storeId, shopId) =>
    API.delete(`/stores/${storeId}/shops/${shopId}`);

/* Transactions & shop-specific endpoints */
export const clearShopDue = async (storeId, shopId, data) =>
    API.post(`/stores/${storeId}/shops/${shopId}/clear-due`, data);

export const getShopTransactions = async (storeId, shopId) =>
    API.get(`/stores/${storeId}/shops/${shopId}/txs`);

export const getAllShopTransactions = async (storeId) =>
    API.get(`/stores/${storeId}/shops/txs`);

export const exchangeCylinder = async (storeId, data) =>
    API.post(`/stores/${storeId}/shops/exchange`, data);
