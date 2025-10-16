import { useQuery } from "@tanstack/react-query";
import { getRegulatorInventory } from "../services/inventoryServices";

/**
 * Custom hook to fetch regulator inventory for a store
 * @param {string} storeId - The ID of the store
 * @param {string} regulatorType - The type of regulator
 * @returns {object} React Query object containing { data, isLoading, isError, error }
 */
export const useRegulatorInventory = (storeId) => {
    return useQuery({
        queryKey: ["regulatorInventory", storeId],
        queryFn: () => getRegulatorInventory({ storeId }),
        enabled: !!storeId, // only fetch when valid
        keepPreviousData: true, // keeps old data while fetching new
    });
};
