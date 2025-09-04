import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getVehicles,
    getSingleVehicle,
    updateVehicleInfo,
    deleteVehicle,
    createVehicle,
} from "../features/vehicle/services/vehicleServices";
import queryClient from "../services/queryClient";
import { VEHICLE, VEHICLES } from "../constants/queryKeys";

// Get all vehicles in a division
export const useVehicles = (workspaceId, divisionId, options = {}) => {
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLES, workspaceId, divisionId],
        queryFn: () => getVehicles(workspaceId, divisionId),
        ...options,
    });

    return { data: data || [], ...rest };
};

// Get details of a single vehicle
export const useSingleVehicle = (
    workspaceId,
    divisionId,
    vehicleId,
    options = {},
) => {
    const { data, ...rest } = useQuery({
        queryKey: [VEHICLE, workspaceId, divisionId, vehicleId],
        queryFn: () => getSingleVehicle(workspaceId, divisionId, vehicleId),
        enabled: !!vehicleId, // don’t fetch if no ID
        ...options,
    });

    return { data: data || null, ...rest };
};

// Create a new vehicle
export const useCreateVehicle = (workspaceId, divisionId, options = {}) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: (vehicleInfo) =>
            createVehicle(workspaceId, divisionId, vehicleInfo),
        onSuccess: () => {
            // Refresh vehicle list after creating a new one
            queryClient.invalidateQueries([VEHICLES, workspaceId, divisionId]);
        },
        ...options,
    });

    return { mutate, ...rest };
};

// Update a single vehicle
export const useUpdateVehicle = (
    workspaceId,
    divisionId,
    vehicleId,
    options = {},
) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: (vehicleInfo) =>
            updateVehicleInfo(workspaceId, divisionId, vehicleId, vehicleInfo),
        onSuccess: () => {
            // invalidate both the list and the single vehicle query
            queryClient.invalidateQueries([VEHICLES, workspaceId, divisionId]);
            queryClient.invalidateQueries([
                VEHICLE,
                workspaceId,
                divisionId,
                vehicleId,
            ]);
        },
        ...options,
    });

    return { mutate, ...rest };
};

// Delete a vehicle
export const useDeleteVehicle = (workspaceId, divisionId, options = {}) => {
    const { mutate, ...rest } = useMutation({
        mutationFn: (vehicleId) =>
            deleteVehicle(workspaceId, divisionId, vehicleId),
        onSuccess: () => {
            queryClient.invalidateQueries([VEHICLES, workspaceId, divisionId]);
        },
        ...options,
    });

    return { mutate, ...rest };
};
