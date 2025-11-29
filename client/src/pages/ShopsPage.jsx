import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaStore } from "react-icons/fa";

import { useAuthStore } from "@/stores/useAuthStore";
import { logOnce } from "./utils/logOnce";

// Components
import { ShopCard, ShopInfoModal, ShopTransactionModal } from "@/features";
import { ConfirmDialog, Modal, Spinner } from "@/components"; // Using generic Modal

import {
    useAllShops,
    useCreateShop,
    useUpdateShop,
    useDeleteShop,
    useShopTransactions,
    useClearShopDue,
    useExchangeCylinder,
} from "@/features/shop/hooks/shopHooks";

export default function ShopsPage() {
    const navigate = useNavigate();
    const storeId = useAuthStore((state) => state.currentStore?.id);

    // Queries & Mutations
    const { data: shops = [], isLoading, isError, error } = useAllShops(storeId);
    const { mutate: createShop, isLoading: isCreating } = useCreateShop(storeId);
    const { mutate: updateShop, isLoading: isUpdating } = useUpdateShop(storeId);
    const { mutate: deleteShop } = useDeleteShop(storeId);

    // Local State
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState("clear_due");
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const [formData, setFormData] = useState({
        shopName: "",
        ownerName: "",
        phoneNumber: "",
        location: "",
        image: "",
    });

    const [editingShop, setEditingShop] = useState(null);
    const [deletingShopId, setDeletingShopId] = useState(null);
    const [transactionShopId, setTransactionShopId] = useState(null);
    const [historyShopId, setHistoryShopId] = useState(null);

    const [transactionData, setTransactionData] = useState({
        amount: "",
        paymentMethod: "cash",
        ref: "",
        details: "",
    });

    // --- Handlers (Keep logic intact) ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const openAddModal = () => {
        setEditingShop(null);
        setFormData({ shopName: "", ownerName: "", phoneNumber: "", location: "", image: "" });
        setIsInfoModalOpen(true);
    };

    const openEditModal = (shop) => {
        setEditingShop(shop);
        setFormData({
            shopName: shop.shopName ?? shop.name ?? "",
            ownerName: shop.ownerName ?? "",
            phoneNumber: shop.phoneNumber ?? "",
            location: shop.location ?? "",
            image: shop.image ?? "",
            id: shop.id ?? shop._id,
        });
        setIsInfoModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            shopName: formData.shopName,
            ownerName: formData.ownerName,
            phoneNumber: formData.phoneNumber,
            location: formData.location,
            image: formData.image,
        };

        if (editingShop) {
            updateShop(
                { shopId: editingShop.id || editingShop._id, ...payload },
                { onSuccess: () => setIsInfoModalOpen(false) }
            );
        } else {
            createShop(payload, {
                onSuccess: () => {
                    setFormData({ shopName: "", ownerName: "", phoneNumber: "", location: "", image: "" });
                    setIsInfoModalOpen(false);
                },
            });
        }
    };

    /* Transactions & History */
    const clearDueMutation = useClearShopDue(storeId, transactionShopId);
    const exchangeMutation = useExchangeCylinder(storeId);

    const {
        data: transactionsHistory = [],
        isLoading: isTransactionsLoading,
        isError: isTransactionsError,
    } = useShopTransactions(storeId, historyShopId, {
        enabled: !!historyShopId && isHistoryOpen,
    });

    const openTransactionModal = (shopId, type = "clear_due") => {
        setTransactionShopId(shopId);
        setTransactionType(type);
        setTransactionData({ amount: "", paymentMethod: "cash", ref: "", details: "" });
        setIsTransactionModalOpen(true);
    };

    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        if (!transactionShopId) return;

        const payload = {
            totalAmount: Number(transactionData.amount) || 0,
            paymentMethod: transactionData.paymentMethod,
            ref: transactionData.ref || undefined,
            details: transactionData.details || undefined,
        };

        if (transactionType === "exchange") {
            exchangeMutation.mutate(
                { shopId: transactionShopId, ...payload },
                { onSuccess: () => setIsTransactionModalOpen(false) }
            );
        } else {
            clearDueMutation.mutate(payload, {
                onSuccess: () => setIsTransactionModalOpen(false)
            });
        }
    };

    return (
        <div className="flex h-full flex-col gap-6 bg-gray-50 p-4 pb-24 lg:p-6 lg:pb-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customer Shops</h1>
                    <p className="text-sm text-gray-500">Manage your B2B customers and dues.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 sm:w-auto"
                >
                    <FaPlus /> Add Shop
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center"><Spinner size={40} /></div>
            ) : isError ? (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">Error: {error?.message}</div>
            ) : shops.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white text-gray-400">
                    <FaStore className="mb-4 text-4xl text-gray-300" />
                    <p>No shops found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {shops.map((shop) => (
                        <ShopCard
                            key={shop.id ?? shop._id}
                            shopInfo={{
                                shopName: shop.shopName ?? shop.name,
                                ownerName: shop.ownerName ?? "",
                                phoneNumber: shop.phoneNumber ?? "",
                                location: shop.location ?? "",
                                image: shop.image ?? "",
                                totalDue: shop.totalDue ?? 0,
                                id: shop.id ?? shop._id,
                            }}
                            onDelete={() => setDeletingShopId(shop.id ?? shop._id)}
                            onUpdate={() => openEditModal(shop)}
                            onRecordTransaction={() => openTransactionModal(shop.id ?? shop._id, "clear_due")}
                            onExchangeCylinder={() => navigate(`/exchange/${shop.id ?? shop._id}`)}
                            onShowHistory={() => {
                                setHistoryShopId(shop.id ?? shop._id);
                                setIsHistoryOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {isInfoModalOpen && (
                <ShopInfoModal
                    isOpen={isInfoModalOpen}
                    onClose={() => setIsInfoModalOpen(false)}
                    editingShop={editingShop}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isCreating={isCreating}
                    isUpdating={isUpdating}
                />
            )}

            <ConfirmDialog
                isOpen={!!deletingShopId}
                title="Confirm Delete"
                message="Are you sure you want to delete this shop?"
                onConfirm={() => {
                    if (deletingShopId) deleteShop(deletingShopId);
                    setDeletingShopId(null);
                }}
                onCancel={() => setDeletingShopId(null)}
            />

            {isTransactionModalOpen && (
                <ShopTransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    transactionType={transactionType}
                    shop={shops.find((s) => (s.id ?? s._id) === transactionShopId)}
                    transactionData={transactionData}
                    handleTransactionChange={(e) => setTransactionData(p => ({ ...p, [e.target.name]: e.target.value }))}
                    handleTransactionSubmit={handleTransactionSubmit}
                    isRecording={clearDueMutation.isLoading || exchangeMutation.isLoading}
                />
            )}

            {/* History Modal using Generic Modal */}
            <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Transaction History" size="lg">
                <div className="space-y-3">
                    {isTransactionsLoading ? (
                        <div className="py-8 text-center text-gray-500">Loading...</div>
                    ) : transactionsHistory.length > 0 ? (
                        transactionsHistory.map((txn, i) => (
                            <div key={i} className="flex justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <div>
                                    <p className="font-semibold text-gray-800 capitalize">{txn.type ?? txn.transactionType}</p>
                                    <p className="text-xs text-gray-500">{txn.details?.description || JSON.stringify(txn.details)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">৳{txn.amount ?? txn.totalAmount ?? txn.total}</p>
                                    <p className="text-xs text-gray-500">{new Date(txn.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="py-8 text-center text-gray-500">No transactions found.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
