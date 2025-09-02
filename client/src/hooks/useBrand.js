import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getDetailedDivisionBrands,
    getDivisionBrands,
    // getGlobalBrands,
    saveSelectedDivisionBrands,
} from "../features/inventory/services/brandServices";
import queryClient from "../services/queryClient";

const GLOBAL_BRANDS = "globalBrands";
const DIVISION_BRANDS = "divisionBrands";
const DETAILED_DIVITION_BRANDS = "detailedDivisionBrands";

// get all global brands
// export const useGlobalBrands = (workspaceId, divisionId, options = {}) => {
//     const { data, ...rest } = useQuery({
//         queryKey: [GLOBAL_BRANDS, workspaceId, divisionId],
//         queryFn: () => getGlobalBrands(workspaceId, divisionId),
//         ...options,
//     });

//     return { data: data?.globalBrands || [], ...rest };
// };

// Get all brands in a division (list only)
export const useDivisionBrands = (workspaceId, divisionId, options = {}) => {
    const { data, ...rest } = useQuery({
        queryKey: [DIVISION_BRANDS, workspaceId, divisionId],
        queryFn: () => getDivisionBrands(workspaceId, divisionId),
        ...options,
    });

    return { data: data?.localBrands || [], ...rest };
};

// Get all brands in a division (detailed)
export const useDetailedDivisionBrands = (
    workspaceId,
    divisionId,
    options = {},
) => {
    const { data, ...rest } = useQuery({
        queryKey: [DETAILED_DIVITION_BRANDS, workspaceId, divisionId],
        queryFn: () => getDetailedDivisionBrands(workspaceId, divisionId),
        ...options,
    });

    return { data: data?.localBrands || [], ...rest };
};

// Select brands in a division
export const useSaveSelectedDivisionBrands = (
    workspaceId,
    divisionId,
    options = {},
) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: (brands) =>
            // brands = [{ id, isActive }]
            saveSelectedDivisionBrands(workspaceId, divisionId, brands),
        onSuccess: () => {
            queryClient.invalidateQueries([
                DIVISION_BRANDS,
                workspaceId,
                divisionId,
            ]);
            queryClient.invalidateQueries([
                DETAILED_DIVITION_BRANDS,
                workspaceId,
                divisionId,
            ]);
        },
        ...options,
    });

    return { mutate, ...rest };
};
