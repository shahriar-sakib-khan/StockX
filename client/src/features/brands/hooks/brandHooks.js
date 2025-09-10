// @ts-check
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getDetailedBrands,
    getBrands,
    saveSelectedBrands,
} from "../services/brandServices";
import queryClient from "@/services/queryClient";
import { BRANDS, DETAILED_BRANDS } from "../constants/brandQueryKeys";

/** @typedef {import("@/features/brands/types/brands").Brand} Brand */
/** @typedef {import("@/features/brands/types/brands").DetailedBrand} DetailedBrand */
/** @typedef {import("@/features/brands/types/brands").BrandsResponse} BrandsResponse */
/** @typedef {import("@/features/brands/types/brands").DetailedBrandsResponse} DetailedBrandsResponse */
/** @typedef {import("@/features/brands/types/brands").SaveBrandsResponse} SaveBrandsResponse */
/** @typedef {import("@/features/brands/types/brands").SelectedBrand} SelectedBrand */

/**
 * Get all brands in a division (basic list view).
 * @param {string} workspaceId
 * @param {string} divisionId
 * @param {import("@tanstack/react-query").UseQueryOptions<BrandsResponse, unknown, BrandsResponse, [string, string, string]>} [options]
 */
export const useBrands = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<BrandsResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [BRANDS, workspaceId, divisionId],
        queryFn: () => getBrands(workspaceId, divisionId),
        ...options,
    });

    return { data: data?.localBrands || [], ...rest };
};

/**
 * Get all brands in a division (detailed).
 * @param {string} workspaceId
 * @param {string} divisionId
 * @param {import("@tanstack/react-query").UseQueryOptions<DetailedBrandsResponse, unknown, DetailedBrandsResponse, [string, string, string]>} [options]
 */
export const useDetailedBrands = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<DetailedBrandsResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [DETAILED_BRANDS, workspaceId, divisionId],
        queryFn: () => getDetailedBrands(workspaceId, divisionId),
        ...options,
    });

    return { data: data?.localBrands || [], ...rest };
};

/**
 * Select brands in a division.
 * @param {string} workspaceId
 * @param {string} divisionId
 * @param {import("@tanstack/react-query").UseMutationOptions<SaveBrandsResponse, unknown, SelectedBrand[], unknown>} [options]
 */
export const useSaveSelectedBrands = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<SaveBrandsResponse, unknown, SelectedBrand[], unknown>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: (brands) =>
            saveSelectedBrands(workspaceId, divisionId, brands),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [DETAILED_BRANDS, workspaceId, divisionId],
            });
            queryClient.invalidateQueries({
                queryKey: [BRANDS, workspaceId, divisionId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};
