import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCylinderPrice } from "../services";

/**
 * Hook for editing cylinder price
 */
export const useEditCylinderPrice = (storeId, size, regulatorType) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: ["cylinderInventory", storeId, size, regulatorType],
        });

    const editPriceMutation = useMutation({
        mutationFn: (payload) =>
            updateCylinderPrice({ storeId, size, regulatorType, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "Price updated successfully!");
            } else {
                toast.error(data?.message || "Failed to update price.");
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Error while updating price.";
            toast.error(message);
        },
    });

    return { editPriceMutation };
};
