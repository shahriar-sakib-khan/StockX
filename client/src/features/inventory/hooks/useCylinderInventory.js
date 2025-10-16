import { useQuery } from "@tanstack/react-query";
import { getCylinderInventory } from "../services/inventoryServices";

/**
 * Custom hook to fetch cylinder inventory for a store
 * @param {string} storeId - The ID of the store
 * @param {number} size - The size of the cylinder
 * @param {string} regulatorType - The type of the regulator
 * @returns {object} React Query object containing { data, isLoading, isError, error }
 */
export const useCylinderInventory = (storeId, size, regulatorType) => {
    return useQuery({
        queryKey: ["cylinderInventory", storeId, size, regulatorType],
        queryFn: () => getCylinderInventory({ storeId, size, regulatorType }),
        enabled: !!storeId && !!size && !!regulatorType,
    });
};
