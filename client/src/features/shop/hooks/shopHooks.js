import { useQuery, useMutation } from "@tanstack/react-query";
import queryClient from "@/services/queryClient";

import {
    getAllShops,
    getSingleShop,
    createShop,
    updateShop,
    deleteShop,
    clearShopDue,
    getShopTransactions,
    getAllShopTransactions,
    exchangeCylinder,
} from "../services/shopService";
import {
    SHOP,
    SHOPS,
    SHOP_TRANSACTION,
    SHOP_TRANSACTIONS,
} from "../constants/shopQueryKeys";

/*
  Note: API wrapper in your project returns response.data (the payload).
  Backend responses are shaped like:
  { success: true, message: "...", data: <payload>, ... }
  Hooks below are defensive: they check both `data?.data` and direct `data` shapes.
*/

const extractPayload = (resp) => {
    if (!resp) return resp;
    // resp might already be the payload; if wrapper returns { success, message, data }
    if (resp.data !== undefined) return resp.data;
    // otherwise assume resp is the payload
    return resp;
};

/* CRUD */

/** Get all shops for a store */
export const useAllShops = (storeId, options) => {
    const { data, ...rest } = useQuery({
        queryKey: [SHOPS, storeId],
        queryFn: () => getAllShops(storeId),
        ...options,
    });

    // backend returns { success, message, pagination, data: shops }
    const payload = extractPayload(data);
    // handle payload.data (controller uses `data: shops`) or direct { shops, total }
    const shops = payload?.data ?? payload?.shops ?? payload ?? [];
    return { data: shops || [], ...rest };
};

/** Get single shop */
export const useSingleShop = (storeId, shopId, options) => {
    const { data, ...rest } = useQuery({
        queryKey: [SHOP, storeId, shopId],
        queryFn: () => getSingleShop(storeId, shopId),
        enabled: !!shopId,
        ...options,
    });

    const payload = extractPayload(data);
    const shop = payload?.data ?? payload ?? {};
    return { data: shop || {}, ...rest };
};

/** Create shop */
export const useCreateShop = (storeId, options) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: (shopInfo) => createShop(storeId, shopInfo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SHOPS, storeId] });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/** Update shop */
export const useUpdateShop = (storeId, options) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: ({ shopId, ...shopInfo }) =>
            updateShop(storeId, shopId, shopInfo),
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({ queryKey: [SHOPS, storeId] });
            if (payload?.shopId) {
                queryClient.invalidateQueries({
                    queryKey: [SHOP, storeId, payload.shopId],
                });
            }
        },
        ...options,
    });

    return { mutate, ...rest };
};

/** Delete shop */
export const useDeleteShop = (storeId, options) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: (shopId) => deleteShop(storeId, shopId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SHOPS, storeId] });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/* ---------------- Transactions / shop tx hooks ---------------- */

/** Clear shop due */
export const useClearShopDue = (storeId, shopId, options) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: (data) => clearShopDue(storeId, shopId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [SHOP_TRANSACTION, storeId, shopId],
            });
            queryClient.invalidateQueries({ queryKey: [SHOPS, storeId] });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/** Exchange cylinder (shop sale) */
export const useExchangeCylinder = (storeId, options) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: (data) => exchangeCylinder(storeId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [SHOP_TRANSACTIONS, storeId],
            });
            queryClient.invalidateQueries({ queryKey: [SHOPS, storeId] });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/** Get transactions for a single shop */
export const useShopTransactions = (storeId, shopId, options) => {
    const { data, ...rest } = useQuery({
        queryKey: [SHOP_TRANSACTION, storeId, shopId],
        queryFn: () => getShopTransactions(storeId, shopId),
        enabled: !!shopId && Boolean(options?.enabled ?? true),
        ...options,
    });

    const payload = extractPayload(data);
    const txs = payload?.data ?? payload?.transactions ?? payload ?? [];
    return { data: txs || [], ...rest };
};

/** Get all shop-related transactions for a store */
export const useAllShopTransactions = (storeId, options) => {
    const { data, ...rest } = useQuery({
        queryKey: [SHOP_TRANSACTIONS, storeId],
        queryFn: () => getAllShopTransactions(storeId),
        ...options,
    });

    const payload = extractPayload(data);
    const txs = payload?.data ?? payload?.transactions ?? payload ?? [];
    return { data: txs || [], ...rest };
};
