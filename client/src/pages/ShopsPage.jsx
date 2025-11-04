import { useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";
import { logOnce } from "./utils/logOnce";

import { ShopCard, ShopInfoModal, ShopTransactionModal } from "@/features";
import { ConfirmDialog, ModalContainer, Spinner } from "@/components";

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
    const storeId = useAuthStore((state) => state.currentStore?.id);

    const {
        data: shops = [],
        isLoading,
        isError,
        error,
    } = useAllShops(storeId);

    const { mutate: createShop, isLoading: isCreating } =
        useCreateShop(storeId);
    const { mutate: updateShop, isLoading: isUpdating } =
        useUpdateShop(storeId);
    const { mutate: deleteShop } = useDeleteShop(storeId);

    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState("clear_due"); // or "exchange"
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

    /* CRUD handlers */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const openAddModal = () => {
        setEditingShop(null);
        setFormData({
            shopName: "",
            ownerName: "",
            phoneNumber: "",
            location: "",
            image: "",
        });
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
        if (editingShop) {
            updateShop(
                {
                    shopId: editingShop.id || editingShop._id,
                    shopName: formData.shopName,
                    ownerName: formData.ownerName,
                    phoneNumber: formData.phoneNumber,
                    location: formData.location,
                    image: formData.image,
                },
                {
                    onSuccess: () => {
                        setIsInfoModalOpen(false);
                        setEditingShop(null);
                    },
                    onError: (err) => console.error("Update shop error:", err),
                },
            );
        } else {
            createShop(
                {
                    shopName: formData.shopName,
                    ownerName: formData.ownerName,
                    phoneNumber: formData.phoneNumber,
                    location: formData.location,
                    image: formData.image,
                },
                {
                    onSuccess: () => {
                        setFormData({
                            shopName: "",
                            ownerName: "",
                            phoneNumber: "",
                            location: "",
                            image: "",
                        });
                        setIsInfoModalOpen(false);
                    },
                    onError: (err) => console.error("Create shop error:", err),
                },
            );
        }
    };

    const handleConfirmDelete = () => {
        if (deletingShopId) {
            deleteShop(deletingShopId, {
                onError: (err) => console.error("Delete shop error:", err),
            });
        }
        setDeletingShopId(null);
    };

    /* Transactions */
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
        setTransactionData({
            amount: "",
            paymentMethod: "cash",
            ref: "",
            details: "",
        });
        setIsTransactionModalOpen(true);
    };

    const openHistoryModal = (shopId) => {
        setHistoryShopId(shopId);
        setIsHistoryOpen(true);
    };

    const closeHistoryModal = () => {
        setIsHistoryOpen(false);
        setHistoryShopId(null);
    };

    const handleTransactionChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((p) => ({ ...p, [name]: value }));
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
            // exchange expects store-level payload (controller expects body)
            exchangeMutation.mutate(
                { shopId: transactionShopId, ...payload },
                {
                    onSuccess: () => setIsTransactionModalOpen(false),
                    onError: (err) => console.error("Exchange error:", err),
                },
            );
        } else {
            clearDueMutation.mutate(payload, {
                onSuccess: () => setIsTransactionModalOpen(false),
                onError: (err) => console.error("Clear due error:", err),
            });
        }
    };

    logOnce(shops);

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 overflow-y-auto bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">
                    Shop List
                </h2>
                <button
                    onClick={openAddModal}
                    className="primary-button flex items-center gap-3 px-3 py-1"
                >
                    Add Shop <span className="text-xl">+</span>
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
                            onDelete={() =>
                                setDeletingShopId(shop.id ?? shop._id)
                            }
                            onUpdate={() =>
                                openEditModal({
                                    shopName: shop.shopName ?? shop.name,
                                    ownerName: shop.ownerName ?? "",
                                    phoneNumber: shop.phoneNumber ?? "",
                                    location: shop.location ?? "",
                                    image: shop.image ?? "",
                                    id: shop.id ?? shop._id,
                                })
                            }
                            onRecordTransaction={() =>
                                openTransactionModal(
                                    shop.id ?? shop._id,
                                    "clear_due",
                                )
                            }
                            onExchangeCylinder={() =>
                                openTransactionModal(
                                    shop.id ?? shop._id,
                                    "exchange",
                                )
                            }
                            onShowHistory={() =>
                                openHistoryModal(shop.id ?? shop._id)
                            }
                        />
                    ))}
                </div>
            )}

            {/* Info Modal */}
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

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={!!deletingShopId}
                title="Confirm Delete"
                message="Are you sure you want to delete this shop? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingShopId(null)}
            />

            {/* Transaction Modal */}
            {isTransactionModalOpen && (
                <ShopTransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    transactionType={transactionType}
                    shop={shops.find(
                        (s) => (s.id ?? s._id) === transactionShopId,
                    )}
                    transactionData={transactionData}
                    handleTransactionChange={handleTransactionChange}
                    handleTransactionSubmit={handleTransactionSubmit}
                    isRecording={
                        clearDueMutation.isLoading || exchangeMutation.isLoading
                    }
                />
            )}

            {/* History Modal */}
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
                                        {txn.type ?? txn.transactionType}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Amount:
                                        </span>{" "}
                                        {txn.amount ??
                                            txn.totalAmount ??
                                            txn.total}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {txn.details?.description ||
                                            txn.details ||
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
