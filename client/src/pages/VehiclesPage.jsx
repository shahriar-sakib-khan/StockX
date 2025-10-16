import { useState } from "react";
import {
    VehicleCard,
    VehicleInfoModal,
    VehicleTransactionModal,
} from "../features";
import { ConfirmDialog, ModalContainer, Spinner } from "../components";
import {
    useAllVehicles,
    useCreateVehicle,
    useUpdateVehicle,
    useDeleteVehicle,
    useVehicleTransactions,
    useFuelVehicle,
    useRepairVehicle,
} from "@/features/vehicle/hooks/vehicleHooks";

import { useAuthStore } from "@/stores/useAuthStore";
import { logOnce } from "./utils/logOnce";

export default function VehiclePage() {
    const storeId = useAuthStore((state) => state.currentStore?.id);

    // Fetch all vehicles
    const {
        data: vehicles = [],
        isLoading,
        isError,
        error,
    } = useAllVehicles(storeId);

    // CRUD mutations
    const { mutate: createVehicle, isLoading: isCreating } =
        useCreateVehicle(storeId);
    const { mutate: updateVehicle, isLoading: isUpdating } =
        useUpdateVehicle(storeId);
    const { mutate: deleteVehicle } = useDeleteVehicle(storeId);

    // Form / UI state
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false); // <-- consistent name
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        regNo: "",
    });
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [deletingVehicleId, setDeletingVehicleId] = useState(null);
    const [transactionVehicleId, setTransactionVehicleId] = useState(null);
    const [historyVehicleId, setHistoryVehicleId] = useState(null);

    const [transactionData, setTransactionData] = useState({
        amount: "",
        category: "fuel_payment",
        paymentMethod: "cash",
        ref: "",
        details: {},
    });

    // CRUD handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingVehicle(null);
        setFormData({ brand: "", model: "", regNo: "" });
        setIsInfoModalOpen(true);
    };

    const openEditModal = (vehicle) => {
        // Accept either frontend-shaped or backend-shaped object
        setEditingVehicle(vehicle);
        setFormData({
            brand: vehicle.brand ?? vehicle.vehicleBrand ?? "",
            model: vehicle.model ?? vehicle.vehicleModel ?? "",
            regNo: vehicle.regNo ?? vehicle.regNumber ?? "",
            id: vehicle.id ?? vehicle._id,
        });
        setIsInfoModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingVehicle) {
            updateVehicle(
                {
                    vehicleId: editingVehicle.id || editingVehicle._id,
                    regNumber: formData.regNo,
                    vehicleBrand: formData.brand,
                    vehicleModel: formData.model,
                },
                {
                    onSuccess: () => {
                        setIsInfoModalOpen(false);
                        setEditingVehicle(null);
                    },
                    onError: (err) =>
                        console.error("Error updating vehicle:", err),
                },
            );
        } else {
            createVehicle(
                {
                    regNumber: formData.regNo,
                    vehicleBrand: formData.brand,
                    vehicleModel: formData.model,
                },
                {
                    onSuccess: () => {
                        setFormData({ brand: "", model: "", regNo: "" });
                        setIsInfoModalOpen(false);
                    },
                    onError: (err) =>
                        console.error("Error creating vehicle:", err),
                },
            );
        }
    };

    const handleConfirmDelete = () => {
        if (deletingVehicleId) {
            deleteVehicle(deletingVehicleId, {
                onError: (err) => console.error("Error deleting vehicle:", err),
            });
        }
        setDeletingVehicleId(null);
    };

    /* ----------------- Transactions ----------------- */
    const fuelMutation = useFuelVehicle(storeId, transactionVehicleId);
    const repairMutation = useRepairVehicle(storeId, transactionVehicleId);

    // Fetch transactions for the currently selected history vehicle.
    // Only enabled when we have both a vehicle id and the modal is open.
    const {
        data: transactionsHistory = [],
        isLoading: isTransactionsLoading,
        isError: isTransactionsError,
    } = useVehicleTransactions(storeId, historyVehicleId, {
        enabled: !!historyVehicleId && isHistoryOpen,
    });

    // open transaction modal (fuel/repair)
    const openTransactionModal = (vehicleId) => {
        setTransactionVehicleId(vehicleId);
        setTransactionData({
            amount: "",
            category: "fuel_payment",
            paymentMethod: "cash",
            ref: "",
            details: {},
        });
        setIsTransactionModalOpen(true);
    };

    // open history modal - set vehicle id then open modal
    const openHistoryModal = (vehicleId) => {
        // debug log — will appear when you click History
        // eslint-disable-next-line no-console
        console.log("Opening history for vehicleId:", vehicleId);
        setHistoryVehicleId(vehicleId);
        setIsHistoryOpen(true);
    };

    const closeHistoryModal = () => {
        setIsHistoryOpen(false);
        setHistoryVehicleId(null);
    };

    const handleTransactionChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        if (!transactionVehicleId) return;
        const { category, ...rest } = transactionData;
        const transactionFn =
            category === "fuel_payment" ? fuelMutation : repairMutation;
        transactionFn.mutate(
            { ...rest, amount: Number(transactionData.amount) || 0 },
            {
                onSuccess: () => setIsTransactionModalOpen(false),
                onError: (err) => console.error("Transaction error:", err),
            },
        );
    };

    // debug log once to inspect vehicles array
    logOnce(vehicles);

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 overflow-y-auto bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">
                    Vehicle List
                </h2>
                <button
                    onClick={openAddModal}
                    className="primary-button flex items-center gap-3 px-3 py-1"
                >
                    Add Vehicle <span className="text-xl">+</span>
                </button>
            </div>

            {isLoading ? (
                <Spinner size={32} />
            ) : isError ? (
                <p className="text-red-500">
                    Error: {error?.message || "Failed"}
                </p>
            ) : (
                <div className="mb-10 flex flex-wrap gap-5">
                    {vehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id ?? vehicle._id}
                            vehicleInfo={{
                                brand: vehicle.vehicleBrand ?? vehicle.brand,
                                model: vehicle.vehicleModel ?? vehicle.model,
                                regNo: vehicle.regNumber ?? vehicle.regNo,
                                id: vehicle.id ?? vehicle._id,
                            }}
                            onDelete={() =>
                                setDeletingVehicleId(vehicle.id ?? vehicle._id)
                            }
                            onUpdate={() =>
                                openEditModal({
                                    brand:
                                        vehicle.vehicleBrand ?? vehicle.brand,
                                    model:
                                        vehicle.vehicleModel ?? vehicle.model,
                                    regNo: vehicle.regNumber ?? vehicle.regNo,
                                    id: vehicle.id ?? vehicle._id,
                                })
                            }
                            onRecordTransaction={() =>
                                openTransactionModal(vehicle.id ?? vehicle._id)
                            }
                            onShowHistory={() =>
                                openHistoryModal(vehicle.id ?? vehicle._id)
                            }
                        />
                    ))}
                </div>
            )}

            {/* Info Modal */}
            {isInfoModalOpen && (
                <VehicleInfoModal
                    isOpen={isInfoModalOpen}
                    onClose={() => setIsInfoModalOpen(false)}
                    editingVehicle={editingVehicle}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isCreating={isCreating}
                    isUpdating={isUpdating}
                />
            )}

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={!!deletingVehicleId}
                title="Confirm Delete"
                message="Are you sure you want to delete this vehicle? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingVehicleId(null)}
            />

            {/* Transaction Modal */}
            {isTransactionModalOpen && (
                <VehicleTransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    transactionVehicle={transactionVehicleId}
                    transactionData={transactionData}
                    handleTransactionChange={handleTransactionChange}
                    handleTransactionSubmit={handleTransactionSubmit}
                    isRecording={
                        fuelMutation.isLoading || repairMutation.isLoading
                    }
                />
            )}

            {/* History Modal (uses the new ModalContainer) */}
            <ModalContainer isOpen={isHistoryOpen} onClose={closeHistoryModal}>
                <div>
                    <h2 className="mb-4 text-lg font-semibold">
                        Transaction History
                    </h2>

                    {isTransactionsLoading ? (
                        <p>Loading...</p>
                    ) : isTransactionsError ? (
                        <p className="text-red-500">
                            Failed to load transactions.
                        </p>
                    ) : transactionsHistory &&
                      transactionsHistory.length > 0 ? (
                        <ul className="space-y-3">
                            {transactionsHistory.map((txn) => (
                                <li
                                    key={txn.id ?? txn._id}
                                    className="rounded border p-3 text-sm text-gray-700"
                                >
                                    <p>
                                        <span className="font-medium">
                                            Type:
                                        </span>{" "}
                                        {txn.transactionType ?? txn.type}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Amount:
                                        </span>{" "}
                                        {txn.amount}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {txn.details?.description ||
                                            JSON.stringify(txn.details ?? {})}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No transactions found.</p>
                    )}
                </div>
            </ModalContainer>
        </div>
    );
}
