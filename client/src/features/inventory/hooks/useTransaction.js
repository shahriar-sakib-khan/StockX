import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { buyCylinders, sellCylinders } from "../services/transactionServices";

/**
 * Hook for buying/selling with toast notifications and automatic cache invalidation
 */
export const useCylinderTransaction = (storeId, size, regulatorType) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: ["cylinderInventory", storeId, size, regulatorType],
        });

    const buyMutation = useMutation({
        mutationFn: (payload) =>
            buyCylinders({ storeId, size, regulatorType, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(
                    data.message || "Cylinders purchased successfully!",
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
                "Error while buying cylinders.";
            toast.error(message);
        },
    });

    const sellMutation = useMutation({
        mutationFn: (payload) =>
            sellCylinders({ storeId, size, regulatorType, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "Cylinders sold successfully!");
            } else {
                toast.error(data?.message || "Sale failed.");
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Error while selling cylinders.";
            toast.error(message);
        },
    });

    return { buyMutation, sellMutation };
};
