import { useQuery } from "@tanstack/react-query";
import { getStoveInventory } from "../services/inventoryServices";

/**
 * Custom hook to fetch stove inventory for a store
 * @param {string} storeId - The ID of the store
 * @param {string} burnerType - The type of stove burner
 * @returns {object} React Query object containing { data, isLoading, isError, error }
 */
export const useStoveInventory = (storeId) => {
    return useQuery({
        queryKey: ["stoveInventory", storeId],
        queryFn: () => getStoveInventory({ storeId }),
        enabled: !!storeId, // fetch only when valid
        keepPreviousData: true, // preserve previous data during background refetch
    });
};
