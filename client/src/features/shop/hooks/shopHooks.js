// @ts-check
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getShops,
    getSingleShop,
    updateShopInfo,
    deleteShop,
    createShop,
} from "../services/shopServices";
import queryClient from "@/services/queryClient";
import { SHOP, SHOPS } from "../constants/shopQueryKeys";

/** type imports
 * @typedef {import("../types/shop").Shop} Shop
 * @typedef {import("../types/shop").NewShop} NewShop
 * @typedef {import("../types/shop").UpdatedShop} UpdatedShop
 * @typedef {import("../types/shop").AllShopsResponse} AllShopsResponse
 * @typedef {import("../types/shop").SingleShopResponse} SingleShopResponse
 * @typedef {import("../types/shop").CreateShopResponse} CreateShopResponse
 * @typedef {import("../types/shop").UpdateShopResponse} UpdateShopResponse
 * @typedef {import("../types/shop").DeleteShopResponse} DeleteShopResponse
 */

/** Shop CRUD query hooks */

/**
 * Get all shops in a division.
 *
 * @param {string} workspaceId
 * @param {string} divisionId
 * @param {import("@tanstack/react-query").UseQueryOptions<AllShopsResponse, unknown, AllShopsResponse, [string, string, string]>} [options]
 */
export const useAllShops = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<AllShopsResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [SHOPS, workspaceId, divisionId],
        queryFn: () => getShops(workspaceId, divisionId),
        ...options,
    });

    return { data: data?.stores || [], ...rest };
};

/**
 * Get details of a single shop by ID.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} shopId - The ID of the shop.
 * @param {import("@tanstack/react-query").UseQueryOptions<SingleShopResponse, unknown, SingleShopResponse, [string, string, string, string]>} [options]
 */
export const useSingleShop = (workspaceId, divisionId, shopId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<SingleShopResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [SHOP, workspaceId, divisionId, shopId],
        queryFn: () => getSingleShop(workspaceId, divisionId, shopId),
        ...options,
    });

    return { data: data?.store || {}, ...rest };
};

/**
 * Create a new shop in a division.
 *
 * @param {string} workspaceId
 * @param {string} divisionId
 * @param {import("@tanstack/react-query").UseMutationOptions<CreateShopResponse, unknown, NewShop>} [options]
 */
export const useCreateShop = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<CreateShopResponse, unknown, NewShop>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {NewShop} shopInfo */ (shopInfo) =>
            createShop(workspaceId, divisionId, shopInfo),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [SHOPS, workspaceId, divisionId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Update an existing shop's information.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {import("@tanstack/react-query").UseMutationOptions<UpdateShopResponse, unknown, { shopId: string } & UpdatedShop>} [options]
 */
export const useUpdateShop = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<UpdateShopResponse, unknown, { shopId: string } & UpdatedShop>} */
    const { mutate, ...rest } = useMutation({
        /** @param {{ shopId: string } & UpdatedShop} payload */
        mutationFn: (payload) => {
            const { shopId, ...shopInfo } = payload;
            return updateShopInfo(workspaceId, divisionId, shopId, shopInfo);
        },
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({
                queryKey: [SHOPS, workspaceId, divisionId],
            });
            queryClient.invalidateQueries({
                queryKey: [SHOP, workspaceId, divisionId, payload.shopId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Delete a shop from a division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {import("@tanstack/react-query").UseMutationOptions<DeleteShopResponse, unknown, string>} [options]
 */
export const useDeleteShop = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<DeleteShopResponse, unknown, string>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {string} shopId */ (shopId) =>
            deleteShop(workspaceId, divisionId, shopId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [SHOPS, workspaceId, divisionId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};
