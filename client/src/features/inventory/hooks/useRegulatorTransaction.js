import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { buyRegulators, sellRegulators } from "../services";

/**
 * Hook for buying/selling regulators with toast and cache invalidation
 */
export const useRegulatorTransaction = (storeId, regulatorType) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: ["regulatorInventory", storeId],
        });

    const buyMutation = useMutation({
        mutationFn: (payload) =>
            buyRegulators({ storeId, regulatorType, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(
                    data.message || "Regulators purchased successfully!",
                );
            } else {
                toast.error(data?.message || "Purchase failed.");
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Error while buying regulators.";
            toast.error(message);
        },
    });

    const sellMutation = useMutation({
        mutationFn: (payload) =>
            sellRegulators({ storeId, regulatorType, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "Regulators sold successfully!");
            } else {
                toast.error(data?.message || "Sale failed.");
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Error while selling regulators.";
            toast.error(message);
        },
    });

    return { buyMutation, sellMutation };
};
