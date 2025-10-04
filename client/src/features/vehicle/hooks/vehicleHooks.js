// @ts-check
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getVehicles,
    getSingleVehicle,
    updateVehicleInfo,
    deleteVehicle,
    createVehicle,
    repairVehicle,
    fuelVehicle,
    getVehicleTransactions,
    getAllVehicleTransactions,
} from "../services/vehicleServices";
import queryClient from "@/services/queryClient";
import {
    VEHICLE,
    VEHICLES,
    VEHICLE_TRANSACTION,
    VEHICLE_TRANSACTIONS,
} from "../constants/vehicleQueryKeys";

/** type imports
 * @typedef {import("../types/vehicle").Vehicle} Vehicle
 * @typedef {import("../types/vehicle").NewVehicle} NewVehicle
 * @typedef {import("../types/vehicle").UpdatedVehicle} UpdatedVehicle
 * @typedef {import("../types/vehicle").AllVehiclesResponse} AllVehiclesResponse
 * @typedef {import("../types/vehicle").SingleVehicleResponse} SingleVehicleResponse
 * @typedef {import("../types/vehicle").CreateVehicleResponse} CreateVehicleResponse
 * @typedef {import("../types/vehicle").UpdateVehicleResponse} UpdateVehicleResponse
 * @typedef {import("../types/vehicle").DeleteVehicleResponse} DeleteVehicleResponse
 * @typedef {import("../types/vehicle").VehicleTransactionInput} VehicleTransactionInput
 * @typedef {import("../types/vehicle").VehicleTransactionResponse} VehicleTransactionResponse
 * @typedef {import("../types/vehicle").AllVehicleTransactionsResponse} AllVehicleTransactionsResponse
 */

/** Vehicle CRUD query hooks */

/**
 * Get all vehicles in a store.
 *
 * @param {string} storeId
 * @param {import("@tanstack/react-query").UseQueryOptions<AllVehiclesResponse, unknown, AllVehiclesResponse, [string, string]>} [options]
 */
export const useAllVehicles = (storeId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<AllVehiclesResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLES, storeId],
        queryFn: () => getVehicles(storeId),
        ...options,
    });

    return { data: data?.vehicles || [], ...rest };
};

/**
 * Get details of a single vehicle by ID.
 *
 * @param {string} storeId
 * @param {string} vehicleId
 * @param {import("@tanstack/react-query").UseQueryOptions<SingleVehicleResponse, unknown, SingleVehicleResponse, [string, string, string]>} [options]
 */
export const useSingleVehicle = (storeId, vehicleId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<SingleVehicleResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLE, storeId, vehicleId],
        queryFn: () => getSingleVehicle(storeId, vehicleId),
        ...options,
    });

    return { data: data?.vehicle || {}, ...rest };
};

/**
 * Create a new vehicle in a store.
 *
 * @param {string} storeId
 * @param {import("@tanstack/react-query").UseMutationOptions<CreateVehicleResponse, unknown, NewVehicle>} [options]
 */
export const useCreateVehicle = (storeId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<CreateVehicleResponse, unknown, NewVehicle>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {NewVehicle} vehicleInfo */ (vehicleInfo) =>
            createVehicle(storeId, vehicleInfo),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES, storeId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Update an existing vehicle's information.
 *
 * @param {string} storeId
 * @param {import("@tanstack/react-query").UseMutationOptions<UpdateVehicleResponse, unknown, { vehicleId: string } & UpdatedVehicle>} [options]
 */
export const useUpdateVehicle = (storeId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<UpdateVehicleResponse, unknown, { vehicleId: string } & UpdatedVehicle>} */
    const { mutate, ...rest } = useMutation({
        /** @param {{ vehicleId: string } & UpdatedVehicle} payload */
        mutationFn: (payload) => {
            const { vehicleId, ...vehicleInfo } = payload;
            return updateVehicleInfo(storeId, vehicleId, vehicleInfo);
        },
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES, storeId],
            });
            queryClient.invalidateQueries({
                queryKey: [VEHICLE, storeId, payload.vehicleId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Delete a vehicle from a store.
 *
 * @param {string} storeId
 * @param {import("@tanstack/react-query").UseMutationOptions<DeleteVehicleResponse, unknown, string>} [options]
 */
export const useDeleteVehicle = (storeId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<DeleteVehicleResponse, unknown, string>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {string} vehicleId */ (vehicleId) =>
            deleteVehicle(storeId, vehicleId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES, storeId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/** ----------------------------------------------------------------------------------------------------------------- */

/** Vehicle transaction query hooks */

/**
 * Record a repair transaction for a vehicle.
 *
 * @param {string} storeId
 * @param {string} vehicleId
 * @param {import("@tanstack/react-query").UseMutationOptions<VehicleTransactionResponse, unknown, VehicleTransactionInput>} [options]
 */
export const useRepairVehicle = (storeId, vehicleId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<VehicleTransactionResponse, unknown, VehicleTransactionInput>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {VehicleTransactionInput} data */ (data) =>
            repairVehicle(storeId, vehicleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLE_TRANSACTION, storeId, vehicleId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Record a fuel transaction for a vehicle.
 *
 * @param {string} storeId
 * @param {string} vehicleId
 * @param {import("@tanstack/react-query").UseMutationOptions<VehicleTransactionResponse, unknown, VehicleTransactionInput>} [options]
 */
export const useFuelVehicle = (storeId, vehicleId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<VehicleTransactionResponse, unknown, VehicleTransactionInput>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {VehicleTransactionInput} data */ (data) =>
            fuelVehicle(storeId, vehicleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLE_TRANSACTION, storeId, vehicleId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Fetch all transactions for a vehicle.
 *
 * @param {string} storeId
 * @param {string} vehicleId
 * @param {import("@tanstack/react-query").UseQueryOptions<AllVehicleTransactionsResponse, unknown>} [options]
 */
export const useVehicleTransactions = (storeId, vehicleId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<AllVehicleTransactionsResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLE_TRANSACTION, storeId, vehicleId],
        queryFn: () => getVehicleTransactions(storeId, vehicleId),
        ...options,
    });

    return { data: data?.transactions || [], ...rest };
};

/**
 * Fetch all transactions across all vehicles in a store.
 *
 * @param {string} storeId
 * @param {import("@tanstack/react-query").UseQueryOptions<AllVehicleTransactionsResponse, unknown>} [options]
 */
export const useAllVehicleTransactions = (storeId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<AllVehicleTransactionsResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLE_TRANSACTIONS, storeId],
        queryFn: () => getAllVehicleTransactions(storeId),
        ...options,
    });

    return { data: data?.transactions || [], ...rest };
};
