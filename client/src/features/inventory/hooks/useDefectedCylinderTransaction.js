import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markDefected, unmarkDefected } from "../services/problemServices";

export const useDefectedCylinderTransaction = (
    storeId,
    size,
    regulatorType,
) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: ["cylinderInventory", storeId, size, regulatorType],
        });

    const markDefectedMutation = useMutation({
        mutationFn: (payload) =>
            markDefected({ storeId, size, regulatorType, payload }),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "Cylinders marked as defected!");
            } else {
                toast.error(data?.message || "Failed to mark defected.");
            }
            invalidateInventory();
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message ||
                    err?.message ||
                    "Error marking defected cylinders.",
            );
        },
    });

    const unmarkDefectedMutation = useMutation({
        mutationFn: (payload) =>
            unmarkDefected({ storeId, size, regulatorType, payload }),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "Defected cylinders removed!");
            } else {
                toast.error(data?.message || "Failed to unmark defected.");
            }
            invalidateInventory();
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message ||
                    err?.message ||
                    "Error unmarking defected cylinders.",
            );
        },
    });

    return { markDefectedMutation, unmarkDefectedMutation };
};
