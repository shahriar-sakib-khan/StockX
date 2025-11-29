import { useState } from "react";
import { FaTruck, FaPlus } from "react-icons/fa";

// Hooks
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

// Components
import {
    VehicleCard,
    VehicleInfoModal,
    VehicleTransactionModal,
} from "@/features"; // Ensure index.js exports these
import { ConfirmDialog, Modal, Spinner } from "@/components"; // Using generic Modal

export default function VehiclePage() {
    const storeId = useAuthStore((state) => state.currentStore?.id);

    // Queries
    const { data: vehicles = [], isLoading, isError, error } = useAllVehicles(storeId);

    // Mutations
    const { mutate: createVehicle, isLoading: isCreating } = useCreateVehicle(storeId);
    const { mutate: updateVehicle, isLoading: isUpdating } = useUpdateVehicle(storeId);
    const { mutate: deleteVehicle } = useDeleteVehicle(storeId);

    // Local State
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const [formData, setFormData] = useState({ brand: "", model: "", regNo: "" });
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

    // Transaction Hooks
    const fuelMutation = useFuelVehicle(storeId, transactionVehicleId);
    const repairMutation = useRepairVehicle(storeId, transactionVehicleId);

    const {
        data: transactionsHistory = [],
        isLoading: isTransactionsLoading,
        isError: isTransactionsError
    } = useVehicleTransactions(storeId, historyVehicleId, { enabled: !!historyVehicleId && isHistoryOpen });

    // --- Handlers ---
    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    const openAddModal = () => {
        setEditingVehicle(null);
        setFormData({ brand: "", model: "", regNo: "" });
        setIsInfoModalOpen(true);
    };

    const openEditModal = (vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            brand: vehicle.vehicleBrand ?? vehicle.brand,
            model: vehicle.vehicleModel ?? vehicle.model,
            regNo: vehicle.regNumber ?? vehicle.regNo,
            id: vehicle.id ?? vehicle._id,
        });
        setIsInfoModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            regNumber: formData.regNo,
            vehicleBrand: formData.brand,
            vehicleModel: formData.model
        };

        if (editingVehicle) {
            updateVehicle({ vehicleId: editingVehicle.id || editingVehicle._id, ...payload }, {
                onSuccess: () => setIsInfoModalOpen(false)
            });
        } else {
            createVehicle(payload, {
                onSuccess: () => setIsInfoModalOpen(false)
            });
        }
    };

    const openTransactionModal = (vehicleId) => {
        setTransactionVehicleId(vehicleId);
        setTransactionData({ amount: "", category: "fuel_payment", paymentMethod: "cash", ref: "", details: {} });
        setIsTransactionModalOpen(true);
    };

    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        if (!transactionVehicleId) return;
        const { category, ...rest } = transactionData;
        const mutation = category === "fuel_payment" ? fuelMutation : repairMutation;

        mutation.mutate(
            { ...rest, amount: Number(transactionData.amount) || 0 },
            { onSuccess: () => setIsTransactionModalOpen(false) }
        );
    };

    return (
        <div className="flex h-full flex-col gap-6 bg-gray-50 p-4 pb-24 lg:p-6 lg:pb-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Vehicle Fleet</h1>
                    <p className="text-sm text-gray-500">Track fuel costs and repairs.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 sm:w-auto"
                >
                    <FaPlus /> Add Vehicle
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center"><Spinner size={40} /></div>
            ) : isError ? (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">Error: {error?.message}</div>
            ) : vehicles.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white text-gray-400">
                    <FaTruck className="mb-4 text-4xl text-gray-300" />
                    <p>No vehicles found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {vehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id ?? vehicle._id}
                            vehicleInfo={{
                                brand: vehicle.vehicleBrand ?? vehicle.brand,
                                model: vehicle.vehicleModel ?? vehicle.model,
                                regNo: vehicle.regNumber ?? vehicle.regNo,
                                id: vehicle.id ?? vehicle._id,
                            }}
                            onDelete={() => setDeletingVehicleId(vehicle.id ?? vehicle._id)}
                            onUpdate={() => openEditModal(vehicle)}
                            onRecordTransaction={() => openTransactionModal(vehicle.id ?? vehicle._id)}
                            onShowHistory={() => {
                                setHistoryVehicleId(vehicle.id ?? vehicle._id);
                                setIsHistoryOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* --- Modals --- */}
            {isInfoModalOpen && (
                <VehicleInfoModal
                    isOpen={isInfoModalOpen}
                    onClose={() => setIsInfoModalOpen(false)}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isProcessing={isCreating || isUpdating}
                    isEdit={!!editingVehicle}
                />
            )}

            <ConfirmDialog
                isOpen={!!deletingVehicleId}
                title="Delete Vehicle"
                message="Are you sure? This will remove all history associated with this vehicle."
                onConfirm={() => {
                    if (deletingVehicleId) deleteVehicle(deletingVehicleId);
                    setDeletingVehicleId(null);
                }}
                onCancel={() => setDeletingVehicleId(null)}
            />

            {isTransactionModalOpen && (
                <VehicleTransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    transactionData={transactionData}
                    handleTransactionChange={(e) => setTransactionData(p => ({ ...p, [e.target.name]: e.target.value }))}
                    handleTransactionSubmit={handleTransactionSubmit}
                    isRecording={fuelMutation.isLoading || repairMutation.isLoading}
                />
            )}

            {/* History Modal */}
            <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Vehicle History" size="lg">
                <div className="space-y-4">
                    {isTransactionsLoading ? (
                        <div className="py-8 text-center text-gray-500">Loading history...</div>
                    ) : transactionsHistory.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">No history found.</div>
                    ) : (
                        transactionsHistory.map((txn, i) => (
                            <div key={i} className="flex justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <div>
                                    <p className="font-semibold text-gray-800 capitalize">{txn.category || txn.type}</p>
                                    <p className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">৳{txn.amount}</p>
                                    <p className="text-xs text-gray-500">{txn.paymentMethod}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </div>
    );
}
