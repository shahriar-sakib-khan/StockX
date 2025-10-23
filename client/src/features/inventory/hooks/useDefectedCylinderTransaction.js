import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { markDefected } from "../services/defectedCylinderServices";

/**
 * Hook for marking/unmarking problem cylinders
 */
export const useDefectedCylinderTransaction = (
    storeId,
    size,
    regulatorType,
    isDefected,
) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: [
                "cylinderInventory",
                storeId,
                size,
                regulatorType,
            ],
        });

    const markDefectedMutation = useMutation({
        mutationFn: (payload) =>
            markDefected({ storeId, size, regulatorType, isDefected, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "Cylinders marked as problem!");
            } else {
                toast.error(
                    data?.message || "Failed to mark problem cylinders.",
                );
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Error while marking problem cylinders.";
            toast.error(message);
        },
    });

    return { markDefectedMutation };
};
