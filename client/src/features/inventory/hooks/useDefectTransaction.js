import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { markDefected, unmarkDefected } from "../services/problemServices";

export const useDefectedTransaction = (storeId, size, regulatorType) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: ["cylinderInventory", storeId, size, regulatorType],
        });

    const markMutation = useMutation({
        mutationFn: (payload) =>
            markDefected({ storeId, size, regulatorType, payload }),
        onSuccess: (data) => {
            if (data?.success)
                toast.success(data.message || "Marked as defected.");
            else toast.error(data?.message || "Failed to mark defected.");
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message ||
                    err.message ||
                    "Error marking as defected.",
            );
        },
        onSettled: invalidateInventory,
    });

    const unmarkMutation = useMutation({
        mutationFn: (payload) =>
            unmarkDefected({ storeId, size, regulatorType, payload }),
        onSuccess: (data) => {
            if (data?.success)
                toast.success(data.message || "Unmarked defected.");
            else toast.error(data?.message || "Failed to unmark defected.");
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message ||
                    err.message ||
                    "Error unmarking defected.",
            );
        },
        onSettled: invalidateInventory,
    });

    return { markMutation, unmarkMutation };
};
