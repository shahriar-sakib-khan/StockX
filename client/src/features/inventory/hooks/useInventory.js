import { useQuery } from "@tanstack/react-query";
import {
    getCylinderInventory,
    getRegulatorInventory,
    getStoveInventory,
} from "../services/inventoryServices";

/**
 * Custom hook to fetch cylinder inventory for a store
 * @param {string} storeId - The ID of the store
 * @param {number} size - The size of the cylinder
 * @param {string} regulatorType - The type of the regulator
 * @returns {object} React Query object containing { data, isLoading, isError, error }
 */
export const useCylinderInventory = (storeId, size, regulatorType) =>
    useQuery({
        queryKey: [
            "cylinderInventory",
            storeId,
            String(size || "all"),
            String(regulatorType || "all"),
        ],
        queryFn: () =>
            getCylinderInventory({
                storeId,
                size: size ? Number(size) : 0,
                regulatorType: regulatorType ? String(regulatorType) : "",
            }),
        enabled: !!storeId,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2,
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        select: (data) => data || [],
    });

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
