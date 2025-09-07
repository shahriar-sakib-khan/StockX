import { useState } from "react";
import { VehicleCard } from "../features";
import { ConfirmDialog, ModalContainer, Spinner } from "../components";
import {
    useAllVehicles,
    useCreateVehicle,
    useUpdateVehicle,
    useDeleteVehicle,
} from "@/hooks/vehicleHooks";
import { workspaceId, divisionId } from "@/constants/ids";

export default function VehiclePage() {
    // Fetch all vehicles
    const {
        data: vehicles = [],
        isLoading,
        isError,
        error,
    } = useAllVehicles(workspaceId, divisionId);

    // Mutations
    const { mutate: createVehicle, isLoading: isCreating } = useCreateVehicle(
        workspaceId,
        divisionId,
    );

    const { mutate: updateVehicle, isLoading: isUpdating } = useUpdateVehicle(
        workspaceId,
        divisionId,
    );

    const { mutate: deleteVehicle } = useDeleteVehicle(workspaceId, divisionId);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        regNo: "",
    });
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingVehicle(null);
        setFormData({ brand: "", model: "", regNo: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            brand: vehicle.brand,
            model: vehicle.model,
            regNo: vehicle.regNo,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingVehicle) {
            // Update vehicle
            updateVehicle(
                {
                    vehicleId: editingVehicle.id,
                    regNumber: formData.regNo,
                    vehicleBrand: formData.brand,
                    vehicleModel: formData.model,
                },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setEditingVehicle(null);
                    },
                    onError: (err) =>
                        console.error("Error updating vehicle:", err),
                },
            );
        } else {
            // Add new vehicle
            createVehicle(
                {
                    regNumber: formData.regNo,
                    vehicleBrand: formData.brand,
                    vehicleModel: formData.model,
                },
                {
                    onSuccess: () => {
                        setFormData({ brand: "", model: "", regNo: "" });
                        setIsModalOpen(false);
                    },
                    onError: (err) =>
                        console.error("Error creating vehicle:", err),
                },
            );
        }
    };

    // const handleDelete = (id) => {
    //     deleteVehicle(id, {
    //         onError: (err) => console.error("Error deleting vehicle:", err),
    //     });
    // };

    // const handleDelete = (id) => {
    //     const confirmed = window.confirm(
    //         "Are you sure you want to delete this vehicle?",
    //     );
    //     if (!confirmed) return;

    //     deleteVehicle(id, {
    //         onError: (err) => console.error("Error deleting vehicle:", err),
    //     });
    // };

    const handleConfirmDelete = () => {
        if (deleteTargetId) {
            deleteVehicle(deleteTargetId, {
                onError: (err) => console.error("Error deleting vehicle:", err),
            });
        }
        setDeleteTargetId(null); // close dialog
    };

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">
                    Vehicle List
                </h2>
                <button
                    onClick={openAddModal}
                    className="primary-button flex items-center gap-3 px-3 py-1"
                >
                    Add Vehicle
                    <span className="text-xl">+</span>
                </button>
            </div>

            {isLoading ? (
                <Spinner size={32} />
            ) : isError ? (
                <p className="text-red-500">Error: {error.message}</p>
            ) : (
                <div className="flex flex-wrap gap-5">
                    {vehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicleInfo={{
                                brand: vehicle.vehicleBrand,
                                model: vehicle.vehicleModel,
                                regNo: vehicle.regNumber,
                                id: vehicle.id,
                            }}
                            onDelete={() => setDeleteTargetId(vehicle.id)}
                            onUpdate={() =>
                                openEditModal({
                                    brand: vehicle.vehicleBrand,
                                    model: vehicle.vehicleModel,
                                    regNo: vehicle.regNumber,
                                    id: vehicle.id,
                                })
                            }
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <ModalContainer
                    backdropColor="bg-black/50"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-semibold text-gray-600">
                            {editingVehicle
                                ? "Edit Vehicle"
                                : "Add New Vehicle"}
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            {/* Brand */}
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="brand"
                                    className="text-sm font-medium text-gray-600"
                                >
                                    Brand
                                </label>
                                <input
                                    id="brand"
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="Brand"
                                    className="flex-1 rounded border border-gray-300 px-3 py-2"
                                    required
                                />
                            </div>

                            {/* Model */}
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="model"
                                    className="text-sm font-medium text-gray-600"
                                >
                                    Model
                                </label>
                                <input
                                    id="model"
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="Model"
                                    className="flex-1 rounded border border-gray-300 px-3 py-2"
                                    required
                                />
                            </div>

                            {/* Registration No */}
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="regNo"
                                    className="text-sm font-medium text-gray-600"
                                >
                                    Registration No
                                </label>
                                <input
                                    id="regNo"
                                    type="text"
                                    name="regNo"
                                    value={formData.regNo}
                                    onChange={handleChange}
                                    placeholder="Registration No"
                                    className="flex-1 rounded border border-gray-300 px-3 py-2"
                                    required
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                >
                                    {editingVehicle
                                        ? isUpdating
                                            ? "Updating..."
                                            : "Update"
                                        : isCreating
                                          ? "Adding..."
                                          : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </ModalContainer>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmDialog
                isOpen={!!deleteTargetId}
                title="Confirm Delete"
                message="Are you sure you want to delete this vehicle? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTargetId(null)}
            />
        </div>
    );
}
