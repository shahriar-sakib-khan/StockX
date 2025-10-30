import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { buyStoves, sellStoves } from "../services";

/**
 * Hook for buying/selling stoves with toast and cache invalidation
 */
export const useStoveTransaction = (storeId, burnerCount) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: ["stoveInventory", storeId],
        });

    const buyMutation = useMutation({
        mutationFn: (payload) => buyStoves({ storeId, burnerCount, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "Stoves purchased successfully!");
            } else {
                toast.error(data?.message || "Purchase failed.");
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Error while buying stoves.";
            toast.error(message);
        },
    });

    const sellMutation = useMutation({
        mutationFn: (payload) => sellStoves({ storeId, burnerCount, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "Stoves sold successfully!");
            } else {
                toast.error(data?.message || "Sale failed.");
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Error while selling stoves.";
            toast.error(message);
        },
    });

    return { buyMutation, sellMutation };
};
