// @ts-check
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getVehicles,
    getSingleVehicle,
    updateVehicleInfo,
    deleteVehicle,
    createVehicle,
    recordVehicleTransaction,
    getVehicleTransactions,
} from "../features/vehicle/services/vehicleServices";
import queryClient from "../services/queryClient";
import { VEHICLE, VEHICLE_TRANSACTION, VEHICLES } from "../constants/queryKeys";

/** @typedef {import("@/types/vehicle").Vehicle} Vehicle */
/** @typedef {import("@/types/vehicle").NewVehicle} NewVehicle */
/** @typedef {import("@/types/vehicle").UpdatedVehicle} UpdatedVehicle */
/** @typedef {import("@/types/vehicle").AllVehiclesResponse} AllVehiclesResponse */
/** @typedef {import("@/types/vehicle").SingleVehicleResponse} SingleVehicleResponse */
/** @typedef {import("@/types/vehicle").CreateVehicleResponse} CreateVehicleResponse */
/** @typedef {import("@/types/vehicle").UpdateVehicleResponse} UpdateVehicleResponse */
/** @typedef {import("@/types/vehicle").DeleteVehicleResponse} DeleteVehicleResponse */

/** @typedef {import("@/types/vehicle").VehicleTransactionInput} VehicleTransactionInput */
/** @typedef {import("@/types/vehicle").VehicleTransactionResponse} VehicleTransactionResponse */
/** @typedef {import("@/types/vehicle").AllVehicleTransactionsResponse} AllVehicleTransactionsResponse */

/**
 * Get all vehicles in a division.
 *
 * @param {string} workspaceId
 * @param {string} divisionId
 * @param {import("@tanstack/react-query").UseQueryOptions<AllVehiclesResponse, unknown, AllVehiclesResponse, [string, string, string]>} [options]
 */
export const useAllVehicles = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<AllVehiclesResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLES, workspaceId, divisionId],
        queryFn: () => getVehicles(workspaceId, divisionId),
        ...options,
    });

    return { data: data?.vehicles || [], ...rest };
};

/**
 * Get details of a single vehicle by ID.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {string} vehicleId - The ID of the vehicle.
 * @param {import("@tanstack/react-query").UseQueryOptions<SingleVehicleResponse, unknown, SingleVehicleResponse, [string, string, string, string]>} [options]
 */
export const useSingleVehicle = (
    workspaceId,
    divisionId,
    vehicleId,
    options,
) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<SingleVehicleResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLE, workspaceId, divisionId, vehicleId],
        queryFn: () => getSingleVehicle(workspaceId, divisionId, vehicleId),
        ...options,
    });

    return { data: data?.vehicle || {}, ...rest };
};

/**
 * Create a new vehicle in a division.
 *
 * @param {string} workspaceId
 * @param {string} divisionId
 * @param {import("@tanstack/react-query").UseMutationOptions<CreateVehicleResponse, unknown, NewVehicle>} [options]
 */
export const useCreateVehicle = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<CreateVehicleResponse, unknown, NewVehicle>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {NewVehicle} vehicleInfo */ (vehicleInfo) =>
            createVehicle(workspaceId, divisionId, vehicleInfo),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES, workspaceId, divisionId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Update an existing vehicle's information.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {import("@tanstack/react-query").UseMutationOptions<UpdateVehicleResponse, unknown, { vehicleId: string } & UpdatedVehicle>} [options]
 */
export const useUpdateVehicle = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<UpdateVehicleResponse, unknown, { vehicleId: string } & UpdatedVehicle>} */
    const { mutate, ...rest } = useMutation({
        /** @param {{ vehicleId: string } & UpdatedVehicle} payload */
        mutationFn: (payload) => {
            const { vehicleId, ...vehicleInfo } = payload;
            return updateVehicleInfo(
                workspaceId,
                divisionId,
                vehicleId,
                vehicleInfo,
            );
        },
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES, workspaceId, divisionId],
            });
            queryClient.invalidateQueries({
                queryKey: [VEHICLE, workspaceId, divisionId, payload.vehicleId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Delete a vehicle from a division.
 *
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} divisionId - The ID of the division.
 * @param {import("@tanstack/react-query").UseMutationOptions<DeleteVehicleResponse, unknown, string>} [options]
 */
export const useDeleteVehicle = (workspaceId, divisionId, options) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<DeleteVehicleResponse, unknown, string>} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {string} vehicleId */ (vehicleId) =>
            deleteVehicle(workspaceId, divisionId, vehicleId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [VEHICLES, workspaceId, divisionId],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/** ----------------------------------------------------------------------------------------------------------------- */

/**
 * Record a new vehicle transaction.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {string} vehicleId - Vehicle ID.
 * @param {import("@tanstack/react-query").UseMutationOptions<VehicleTransactionResponse, unknown, VehicleTransactionInput >} [options]
 */
export const useRecordVehicleTransaction = (
    workspaceId,
    divisionId,
    vehicleId,
    options,
) => {
    /** @type {import("@tanstack/react-query").UseMutationResult<VehicleTransactionResponse, unknown, VehicleTransactionInput >} */
    const { mutate, ...rest } = useMutation({
        mutationFn: /** @param {VehicleTransactionInput} data */ (data) =>
            recordVehicleTransaction(workspaceId, divisionId, vehicleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    VEHICLE_TRANSACTION,
                    workspaceId,
                    divisionId,
                    vehicleId,
                ],
            });
        },
        ...options,
    });

    return { mutate, ...rest };
};

/**
 * Fetch all transactions for a vehicle.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @param {string} vehicleId - Vehicle ID.
 * @param {import("@tanstack/react-query").UseQueryOptions<AllVehicleTransactionsResponse, unknown>} [options] - Optional React Query options.
 */
export const useVehicleTransactions = (
    workspaceId,
    divisionId,
    vehicleId,
    options,
) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<AllVehicleTransactionsResponse, unknown>} */
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLE_TRANSACTION, workspaceId, divisionId, vehicleId],
        queryFn: () =>
            getVehicleTransactions(workspaceId, divisionId, vehicleId),
        ...options,
    });

    return { data, ...rest };
};
