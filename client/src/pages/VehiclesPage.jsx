import { useEffect, useState } from "react";
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
    useRecordVehicleTransaction,
    useVehicleTransactions,
} from "@/hooks/vehicleHooks";
import { workspaceId, divisionId } from "@/constants/ids";

export default function VehiclePage() {
    // Fetch: all vehicles
    const {
        data: vehicles = [],
        isLoading,
        isError,
        error,
    } = useAllVehicles(workspaceId, divisionId);

    // Fetch: transactions of a vehicle

    // Vehicle Mutations: CRUD
    const { mutate: createVehicle, isLoading: isCreating } = useCreateVehicle(
        workspaceId,
        divisionId,
    );

    const { mutate: updateVehicle, isLoading: isUpdating } = useUpdateVehicle(
        workspaceId,
        divisionId,
    );

    const { mutate: deleteVehicle } = useDeleteVehicle(workspaceId, divisionId);

    // Vehicle Mutations: Transaction

    // Vehicle States: CRUD
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        regNo: "",
    });
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [deletingVehicleId, setDeletingVehicleId] = useState(null);

    // Vehicle States: Transaction
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [IshistoryModalOpen, setIshistoryModalOpen] = useState(false);
    const [transactionVehicleId, setTransactionVehicleId] = useState(null);
    const [historyVehicleId, setHistoryVehicleId] = useState(null);
    const [transactionData, setTransactionData] = useState({
        amount: "",
        /** @type {'fuel_payment' | 'repair_payment'} category */
        category: "fuel_payment",
        /** @type {'cash' | 'bank' | 'mobile' | 'due' | 'other'} paymentMethod */
        paymentMethod: "cash",
        ref: "",
        details: {},
    });

    useEffect(() => {
        console.log(transactionData);
    }, [transactionData]);

    // Vehicle Handlers: CRUD
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
        setEditingVehicle(vehicle);
        setFormData({
            brand: vehicle.brand,
            model: vehicle.model,
            regNo: vehicle.regNo,
        });
        setIsInfoModalOpen(true);
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
                        setIsInfoModalOpen(false);
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
        setDeletingVehicleId(null); // close dialog
    };

    /** -------------------------------------------------------------------------------------------- */
    // Vehicle Handlers: Transaction

    // Transaction mutation
    const { mutate: recordTransaction, isLoading: isRecording } =
        useRecordVehicleTransaction(
            workspaceId,
            divisionId,
            transactionVehicleId,
            {
                enabled: !!transactionVehicleId,
            },
        );

    // Fetch transactions for selected vehicle
    const { data: transactionsHistory, isLoading: isTransactionsLoading } =
        useVehicleTransactions(workspaceId, divisionId, historyVehicleId, {
            enabled: !!historyVehicleId, // only fetch when a vehicle is selected
        });

    useEffect(() => {
        console.log(transactionsHistory);
    }, [transactionsHistory]);

    // Open transaction modal for a specific vehicle
    const openTransactionModal = /** @param {string} vehicleId */ (
        vehicleId,
    ) => {
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

    const openHistoryModal = /** @param {string} vehicleId */ (vehicleId) => {
        setHistoryVehicleId(vehicleId);
        setIshistoryModalOpen(true);
    };

    // Handle transaction form input
    const handleTransactionChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit transaction
    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        if (transactionVehicleId) {
            recordTransaction(
                {
                    ...transactionData,
                    amount: Number(transactionData.amount) || 0,
                },
                {
                    onSuccess: () => setIsTransactionModalOpen(false),
                    onError: (err) => console.error(err),
                },
            );
        }
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
                            onDelete={() => setDeletingVehicleId(vehicle.id)}
                            onUpdate={() =>
                                openEditModal({
                                    brand: vehicle.vehicleBrand,
                                    model: vehicle.vehicleModel,
                                    regNo: vehicle.regNumber,
                                    id: vehicle.id,
                                })
                            }
                            onRecordTransaction={() =>
                                openTransactionModal(vehicle.id)
                            }
                            onShowHistory={() => openHistoryModal(vehicle.id)}
                        />
                    ))}
                </div>
            )}

            {/* Vehicle Info Modal */}
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

            {/* Confirm Delete Modal */}
            <ConfirmDialog
                isOpen={!!deletingVehicleId}
                title="Confirm Delete"
                message="Are you sure you want to delete this vehicle? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingVehicleId(null)}
            />

            {isTransactionModalOpen && (
                <VehicleTransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    transactionVehicle={transactionVehicleId}
                    transactionData={transactionData}
                    handleTransactionChange={handleTransactionChange}
                    handleTransactionSubmit={handleTransactionSubmit}
                    isRecording={isRecording}
                />
            )}

            {IshistoryModalOpen && (
                <ModalContainer onClose={() => setIshistoryModalOpen(false)}>
                    <div className="p-4">
                        <h2 className="mb-4 text-lg font-semibold">
                            Transaction History
                        </h2>

                        {isTransactionsLoading ? (
                            <p>Loading...</p>
                        ) : transactionsHistory?.data?.length ? (
                            <ul className="space-y-2">
                                {transactionsHistory.data.map((txn) => (
                                    <li
                                        key={txn.id}
                                        className="rounded border p-2 text-sm text-gray-600"
                                    >
                                        <span className="font-medium">
                                            {txn.category}
                                        </span>{" "}
                                        - {txn.amount} ({txn.paymentMethod})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">
                                No transactions found.
                            </p>
                        )}
                    </div>
                </ModalContainer>
            )}
        </div>
    );
}
