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
    doMark,
) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: ["cylinderInventory", storeId, size, regulatorType],
        });

    const markDefectedMutation = useMutation({
        mutationFn: (payload) =>
            markDefected({ storeId, size, regulatorType, doMark, payload }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(
                    data.message || "Defected cylinders updated successfully!",
                );
            } else {
                toast.error(
                    data?.message || "Failed to update defected cylinders.",
                );
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Error while marking defected cylinders.";
            toast.error(message);
        },
    });

    return { markDefectedMutation };
};
