import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getBrands,
    getDetailedBrands,
    saveSelectedBrands,
} from "../services/brandServices";
import { BRANDS, DETAILED_BRANDS } from "../constants/brandQueryKeys";

export const useBrands = (storeId, options) => {
    const { data, ...rest } = useQuery({
        queryKey: [BRANDS, storeId],
        queryFn: () => getBrands(storeId),
        ...options,
    });

    return { data: data?.localBrands || [], ...rest };
};

export const useDetailedBrands = (storeId, options) => {
    const { data, ...rest } = useQuery({
        queryKey: [DETAILED_BRANDS, storeId],
        queryFn: () => getDetailedBrands(storeId),
        ...options,
    });

    return { data: data?.localBrands || [], ...rest };
};

export const useSaveSelectedBrands = (storeId, options) => {
    const queryClient = useQueryClient();

    const { mutate, ...rest } = useMutation({
        mutationFn: async (brands) => {
            const response = await saveSelectedBrands(storeId, brands);
            return {
                success: true,
                message:
                    response.data?.message || "Brands updated successfully",
                updatedBrands: response.data?.updatedBrands || brands,
            };
        },

        onSuccess: (data) => {
            // ✅ Invalidate brand-related queries
            queryClient.invalidateQueries({ queryKey: [BRANDS, storeId] });
            queryClient.invalidateQueries({
                queryKey: [DETAILED_BRANDS, storeId],
            });

            // ✅ Invalidate dependent inventory queries
            queryClient.invalidateQueries({
                queryKey: ["cylinderInventory", storeId],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["stoveInventory", storeId],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ["regulatorInventory", storeId],
                exact: false,
            });

            options?.onSuccess?.(data);
        },

        onError: (error) => {
            console.error("Failed to update brands:", error);
            options?.onError?.(error);
        },
    });

    return { mutate, ...rest };
};
