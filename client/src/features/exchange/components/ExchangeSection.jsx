import { useState } from "react";
import clsx from "clsx";

import { useExchangeStore } from "@/stores/useExchangeStore";
import { ConfirmDialog } from "@/components";

import { AddButton } from "../utils";
import {
    GiveCylinderModal,
    BrandSelectionModal,
    QuantityModal,
    ExchangeList,
} from "./index";

export default function ExchangeSection({ type }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        uid: null,
    });

    const isGive = type === "give";

    // Zustand slice selectors
    const addItem = useExchangeStore((s) => s.addItem);
    const updateItem = useExchangeStore((s) => s.updateItem);
    const removeItem = useExchangeStore((s) => s.removeItem);
    const normalizePayload = useExchangeStore((s) => s.normalizePayload);

    /* ---------------------------------------------
     * Add
     * ------------------------------------------- */
    const handleAdd = (rawPayload) => {
        const item = normalizePayload(type, rawPayload);
        addItem(type, item);
        setIsModalOpen(false);
    };

    /* ---------------------------------------------
     * Edit
     * ------------------------------------------- */
    const handleEditDone = (rawPayload) => {
        if (!editingItem) return;

        const normalized = normalizePayload(type, {
            ...editingItem,
            ...rawPayload,
        });

        updateItem(type, editingItem.uid, normalized);
        setEditingItem(null);
    };

    /* ---------------------------------------------
     * Delete
     * ------------------------------------------- */
    const handleDeleteRequest = (uid) => setConfirmDelete({ open: true, uid });

    const handleDeleteConfirm = () => {
        removeItem(type, confirmDelete.uid);
        setConfirmDelete({ open: false, uid: null });
    };

    const handleDeleteCancel = () =>
        setConfirmDelete({ open: false, uid: null });

    /* ---------------------------------------------
     * Render
     * ------------------------------------------- */
    return (
        <div
            className={clsx(
                "flex-1 rounded-2xl border p-6 shadow-sm",
                isGive
                    ? "border-green-200 bg-green-50"
                    : "border-blue-200 bg-blue-50",
            )}
        >
            <h2
                className={clsx(
                    "mb-4 text-2xl font-semibold",
                    isGive ? "text-green-700" : "text-blue-700",
                )}
            >
                {isGive ? "Give" : "Take"}
            </h2>

            <ExchangeList
                type={type}
                onEdit={setEditingItem}
                onDelete={handleDeleteRequest}
            />

            <div className="mt-8 flex justify-center">
                <AddButton
                    variant={type}
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            {/* Add Modals */}
            {isGive ? (
                <GiveCylinderModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleAdd}
                />
            ) : (
                <BrandSelectionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onBrandSelect={handleAdd}
                />
            )}

            {/* Edit Modal */}
            {editingItem && (
                <QuantityModal
                    isOpen
                    onClose={() => setEditingItem(null)}
                    cylinder={editingItem.cylinder}
                    initialQuantity={editingItem.quantity}
                    initialTotal={editingItem.total}
                    onDone={handleEditDone}
                    type={type}
                />
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={confirmDelete.open}
                title="Confirm remove"
                message="Are you sure you want to remove this item?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
}
