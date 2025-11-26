import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createSwapPost } from "../services/swap";

export const useCreateSwapPost = (storeId, options = {}) => {
    const qc = useQueryClient();

    return useMutation({
        // mutationFn: (payload) => createSwapPost(storeId, payload),
        mutationFn: async (payload) => {
            // ---------- DEMO RESPONSE ----------
            return {
                id: "demo-" + Date.now(),
                ...payload,
                createdAt: new Date().toISOString(),
            };
        },
        onSuccess: () => {
            qc.invalidateQueries(["swapPosts", storeId]);
        },
        ...options,
    });
};
