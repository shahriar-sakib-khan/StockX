import React, { useState } from "react";

import { ConfirmDialog } from "@/components";
import { useExchangeStore } from "@/stores/useExchangeStore";

import {
    QuantityModal,
    TakeCylinderModal,
} from "@/features/common/cylinderSelection";

export default function ExchangeList({ type }) {
    const list = useExchangeStore((s) => s[type]);
    const updateItem = useExchangeStore((s) => s.updateItem);
    const removeItem = useExchangeStore((s) => s.removeItem);
    const normalizePayload = useExchangeStore((s) => s.normalizePayload);

    const isGive = type === "give";

    const [editingItem, setEditingItem] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        uid: null,
    });

    /* ---------------------------------------------
     * Save edits (using store's normalization)
     * ------------------------------------------- */
    const handleEditDone = (payload) => {
        if (!editingItem) return;

        // Normalize with merged original item + new fields
        const normalized = normalizePayload(type, {
            ...editingItem,
            ...payload,
        });

        updateItem(type, editingItem.uid, normalized);
        setEditingItem(null);
    };

    /* ---------------------------------------------
     * Remove item
     * ------------------------------------------- */
    const doRemove = () => {
        removeItem(type, confirmDelete.uid);
        setConfirmDelete({ open: false, uid: null });
    };

    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 capitalize">
                {type} Cylinders
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-gray-700">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold">
                            <th className="p-3">Brand</th>
                            <th className="p-3">Image</th>
                            <th className="p-3">Size</th>
                            <th className="p-3">Regulator</th>
                            <th className="p-3">Qty</th>
                            {isGive && <th className="p-3">Total</th>}
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {list.map((item) => {
                            const img =
                                item.cylinder?.cylinderImage ||
                                item.cylinder?.image ||
                                "/placeholder.png";

                            return (
                                <tr
                                    key={item.uid}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="p-3 font-medium">
                                        {item.brand}
                                    </td>

                                    <td className="p-3">
                                        <img
                                            src={img}
                                            className="h-12 w-12 rounded-lg border border-gray-100 object-contain shadow-sm"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/placeholder.png")
                                            }
                                        />
                                    </td>

                                    <td className="p-3">{item.size}</td>

                                    <td className="p-3">
                                        {item.regulatorType}
                                    </td>

                                    <td className="p-3">{item.quantity}</td>

                                    {isGive && (
                                        <td className="p-3 font-medium text-gray-900">
                                            ৳
                                            {Number(
                                                item.total,
                                            ).toLocaleString()}
                                        </td>
                                    )}

                                    <td className="space-x-2 p-3 text-right">
                                        <button
                                            onClick={() => setEditingItem(item)}
                                            className="rounded-lg bg-gray-100 px-4 py-1 text-sm font-medium text-gray-800 transition hover:bg-gray-200"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                setConfirmDelete({
                                                    open: true,
                                                    uid: item.uid,
                                                })
                                            }
                                            className="rounded-lg bg-red-500 px-4 py-1 text-sm font-medium text-white transition hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {editingItem &&
                (isGive ? (
                    <QuantityModal
                        isOpen
                        onClose={() => setEditingItem(null)}
                        cylinder={editingItem.cylinder}
                        initialQuantity={editingItem.quantity}
                        initialTotal={editingItem.total}
                        type={type}
                        onDone={handleEditDone}
                    />
                ) : (
                    <TakeCylinderModal
                        isOpen
                        onClose={() => setEditingItem(null)}
                        brand={{
                            id: editingItem.brandId,
                            name: editingItem.brand,
                            brandImage: editingItem.cylinder?.brandImage,
                        }}
                        // send existing values as initial state
                        initialSize={editingItem.size}
                        initialRegulatorType={editingItem.regulatorType}
                        initialQuantity={editingItem.quantity}
                        // once user edits, update
                        onDone={(payload) => handleEditDone(payload)}
                    />
                ))}

            <ConfirmDialog
                isOpen={confirmDelete.open}
                title="Confirm Remove"
                message="Remove this cylinder?"
                onConfirm={doRemove}
                onCancel={() => setConfirmDelete({ open: false, uid: null })}
            />
        </div>
    );
}
