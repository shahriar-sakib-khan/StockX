import { useState } from "react";
import { divisionId, workspaceId } from "@/constants/ids";
import {
    useAllVehicles,
    useCreateVehicle,
    useUpdateVehicle,
    useDeleteVehicle,
} from "@/hooks/vehicleHooks";

export default function TestVehicles() {
    // Fetch all vehicles
    const {
        data: vehicles,
        isLoading,
        isError,
        error,
    } = useAllVehicles(workspaceId, divisionId);

    // Create vehicle mutation
    const { mutate: create, isLoading: isCreating } = useCreateVehicle(
        workspaceId,
        divisionId,
    );

    // Update vehicle mutation
    const { mutate: update, isLoading: isUpdating } = useUpdateVehicle(
        workspaceId,
        divisionId,
        // placeholder, we will pass ID dynamically
        "",
    );

    // Delete vehicle mutation
    const { mutate: remove, isLoading: isDeleting } = useDeleteVehicle(
        workspaceId,
        divisionId,
    );

    const [vehicleInput] = useState({
        regNumber: Date.now().toString(),
        vehicleBrand: "Begun",
        vehicleModel: "Alu",
    });

    const onCreate = () => {
        create(vehicleInput, {
            onSuccess: (res) => console.log("Created vehicle:", res),
            onError: (err) => console.error("Create error:", err),
        });
    };

    const onUpdate = (vehicleId) => {
        update(
            vehicleId,
            {
                vehicleBrand: "Updated Brand",
                vehicleModel: "Updated Model",
                regNumber: Date.now().toString(),
            },
            {
                onSuccess: (res) => console.log("Updated vehicle:", res),
                onError: (err) => console.error("Update error:", err),
            },
        );
    };

    const onDelete = (vehicleId) => {
        remove(vehicleId, {
            onSuccess: (res) => console.log("Deleted vehicle:", res),
            onError: (err) => console.error("Delete error:", err),
        });
    };

    return (
        <div className="rounded border bg-gray-50 p-4">
            <h2 className="font-semibold">Vehicles</h2>

            {isLoading && <p>Loading...</p>}
            {isError && <p className="text-red-500">Error: {error.message}</p>}

            <ul className="list-disc pl-5">
                {vehicles.map((v) => (
                    <li
                        key={v.id}
                        className="flex items-center justify-between"
                    >
                        <span>
                            {v.vehicleBrand} {v.vehicleModel} ({v.regNumber})
                        </span>
                        <span className="space-x-2">
                            <button
                                onClick={() => onUpdate(v.vehicleId)}
                                disabled={isUpdating}
                                className="rounded bg-yellow-400 px-2 py-1 text-white"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => onDelete(v.id)}
                                disabled={isDeleting}
                                className="rounded bg-red-500 px-2 py-1 text-white"
                            >
                                Delete
                            </button>
                        </span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onCreate}
                disabled={isCreating}
                className="mt-2 rounded bg-blue-500 px-3 py-1 text-white"
            >
                {isCreating ? "Adding..." : "Add Vehicle"}
            </button>
        </div>
    );
}
