import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getBrands, updateBrands } from "../services/brandServices";

/**
 * Fetch brands for a given store
 */
export const useBrands = (storeId, mode = "all") => {
    return useQuery({
        queryKey: ["brands", storeId, mode],
        queryFn: () => getBrands(storeId, mode),
        enabled: !!storeId,
    });
};

/**
 * Update selected brands
 */
export const useUpdateBrands = (storeId, onSuccess) => {
    const queryClient = useQueryClient();

    const invalidateInventory = () =>
        queryClient.invalidateQueries({
            queryKey: ["cylinderInventory", storeId],
        });

    return useMutation({
        mutationFn: (changedBrands) => updateBrands(storeId, changedBrands),
        onSuccess: (response) => {
            toast.success(response?.message || "Brands updated successfully!");
            if (onSuccess) setTimeout(onSuccess, 500);
            invalidateInventory();
        },
        onError: (err) => {
            const msg =
                err?.response?.data?.message ||
                "Failed to update brands. Try again.";
            toast.error(msg);
        },
    });
};
