// @ts-check
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getBrands,
    getDetailedBrands,
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
 * Fetch all brands for a store (basic list view).
 * @param {string} storeId
 * @param {import("@tanstack/react-query").UseQueryOptions<BrandsResponse, unknown, BrandsResponse, [string, string]>} [options]
 */
export const useBrands = (storeId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<BrandsResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [BRANDS, storeId],
        queryFn: () => getBrands(storeId),
        ...options,
    });

    return { data: data?.localBrands || [], ...rest };
};

/**
 * Fetch detailed brand information for a store.
 * @param {string} storeId
 * @param {import("@tanstack/react-query").UseQueryOptions<DetailedBrandsResponse, unknown, DetailedBrandsResponse, [string, string]>} [options]
 */
export const useDetailedBrands = (storeId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<DetailedBrandsResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [DETAILED_BRANDS, storeId],
        queryFn: () => getDetailedBrands(storeId),
        ...options,
    });

    return { data: data?.localBrands || [], ...rest };
};

/**
 * Save (select) specific brands for a store.
 * @param {string} storeId
 * @param {import("@tanstack/react-query").UseMutationOptions<SaveBrandsResponse, unknown, SelectedBrand[], unknown>} [options]
 */
export const useSaveSelectedBrands = (storeId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<SaveBrandsResponse, unknown, SelectedBrand[], unknown>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: async (brands) => {
            const response = await saveSelectedBrands(storeId, brands);
            // Ensure the response matches the SaveBrandsResponse structure
            return {
                message: response.data?.message || "Brands updated successfully", // Assuming the API response has a `message` field.
                updatedBrands: response.data?.updatedBrands || brands, // You can also handle this depending on the API response.
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DETAILED_BRANDS, storeId] });
            queryClient.invalidateQueries({ queryKey: [BRANDS, storeId] });
        },
        ...options,
    });

    return { mutate, ...rest };
};
