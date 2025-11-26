import { useState, useEffect, useMemo } from "react";

import { Modal } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { SIZES, TYPES } from "@/constants/cylinderSizeAndTypes";
import { useCylinderInventory } from "@/features/inventory/hooks";

import { CylinderFilters } from "./index";

/**
 * TakeCylinderModal
 * - For selecting a size + regulator + quantity.
 * - Prefills quantity if provided (e.g., editing item from exchange list).
 */
export default function TakeCylinderModal({
    isOpen,
    onClose,
    brand,
    initialQuantity = "",
    onDone,
}) {
    const storeId = useAuthStore((s) => s.currentStore?.id);

    const [size, setSize] = useState("12");
    const [regulatorType, setRegulatorType] = useState("22");
    const [quantity, setQuantity] = useState("");

    // ----- Prefill quantity on first open -----
    useEffect(() => {
        if (isOpen) {
            setQuantity(initialQuantity || "");
        }
    }, [isOpen, initialQuantity]);

    // When size / regulator / brand changes → reset quantity for safety
    useEffect(() => {
        if (isOpen) {
            setQuantity(initialQuantity || "");
        }
    }, [size, regulatorType, brand, isOpen, initialQuantity]);

    // Fetch inventory based on filters
    const { data: inventory = [], isLoading } = useCylinderInventory(
        storeId,
        size,
        regulatorType,
        "all",
    );

    // Match cylinder by brand (case-insensitive)
    const matchedCylinder = useMemo(() => {
        if (!brand) return null;
        return inventory.find(
            (cyl) =>
                cyl.brandName?.trim()?.toLowerCase() ===
                brand.name?.trim()?.toLowerCase(),
        );
    }, [inventory, brand]);

    // ---------------- Handle Add ----------------
    const handleAdd = () => {
        if (!quantity || !matchedCylinder) return;

        onDone({
            brand,
            id: matchedCylinder.id,
            cylinder: { ...matchedCylinder },
            size,
            regulatorType,
            quantity: Number(quantity),
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Take Cylinders"
            size="md"
        >
            {/* Brand header */}
            {brand && (
                <div className="mb-4 flex items-center gap-4">
                    <img
                        src={brand.brandImage}
                        alt={brand.name}
                        className="h-14 w-14 rounded object-contain"
                    />
                    <h2 className="text-lg font-semibold text-gray-700">
                        {brand.name}
                    </h2>
                </div>
            )}

            {/* Filters */}
            <CylinderFilters
                sizes={SIZES}
                regulatorTypes={TYPES}
                size={size}
                regulatorType={regulatorType}
                onSizeChange={setSize}
                onRegulatorTypeChange={setRegulatorType}
            />

            {/* Quantity */}
            <div className="mt-6">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Quantity
                </label>

                <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Enter number of cylinders"
                    disabled={isLoading}
                />
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    onClick={handleAdd}
                    disabled={!quantity || !matchedCylinder}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    Add
                </button>
            </div>
        </Modal>
    );
}
