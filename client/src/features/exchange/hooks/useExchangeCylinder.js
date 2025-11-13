import { useMutation, useQueryClient } from "@tanstack/react-query";

import { exchangeCylinder } from "../services/exchange";

const SHOP_TRANSACTIONS = "shopTransactions";
const SHOPS = "shops";

export const useExchangeCylinder = (storeId, options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => exchangeCylinder(storeId, data),
        onSuccess: (data, variables) => {
            // invalidate lists relevant (replace keys with your app keys)
            queryClient.invalidateQueries({
                queryKey: [SHOP_TRANSACTIONS, storeId],
            });
            queryClient.invalidateQueries({ queryKey: [SHOPS, storeId] });
            if (options.onSuccess) options.onSuccess(data, variables);
        },
        onError: (err) => {
            if (options.onError) options.onError(err);
        },
        ...options,
    });
};
