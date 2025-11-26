import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { performSwap } from "../services/swap";

export const usePerformSwap = (storeId, options = {}) => {
    const qc = useQueryClient();

    return useMutation({
        // mutationFn: (data) => performSwap(storeId, data),
        mutationFn: async (payload) => {
            // ---------- DEMO ----------
            return {
                success: true,
                swapId: "swap-" + Date.now(),
                ...payload,
            };
        },
        onSuccess: () => {
            qc.invalidateQueries(["swapPosts", storeId]);
        },
        ...options,
    });
};
