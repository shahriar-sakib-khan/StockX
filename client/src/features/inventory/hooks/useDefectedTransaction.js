import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markDefected } from "../services";

/**
 * Generic hook for marking/unmarking defected products.
 * Works for cylinders, regulators, and stoves.
 */
export const useDefectedTransaction = ({
    type, // "cylinders" | "regulators" | "stoves"
    storeId,
    size,
    regulatorType,
    burnerCount,
    doMark,
}) => {
    const queryClient = useQueryClient();

    // Construct a unique query key depending on type
    const queryKey = {
        cylinders: ["cylinderInventory", storeId, size, regulatorType],
        regulators: ["regulatorInventory", storeId],
        stoves: ["stoveInventory", storeId, ],
    }[type];

    const invalidateInventory = () =>
        queryClient.invalidateQueries({ queryKey });

    const markDefectedMutation = useMutation({
        mutationFn: (payload) =>
            markDefected({
                type,
                storeId,
                size,
                regulatorType,
                burnerCount,
                doMark,
                payload,
            }),

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(
                    data.message || `Defected ${type} updated successfully!`,
                );
            } else {
                toast.error(
                    data?.message || `Failed to update defected ${type}.`,
                );
            }
            invalidateInventory();
        },

        onError: (err) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                `Error while marking defected ${type}.`;
            toast.error(message);
        },
    });

    return { markDefectedMutation };
};
