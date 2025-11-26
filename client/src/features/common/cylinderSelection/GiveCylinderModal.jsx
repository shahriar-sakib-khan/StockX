import { useState } from "react";
import clsx from "clsx";

import { Modal } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCylinderInventory } from "@/features/inventory/hooks";
import { SIZES, TYPES } from "@/constants/cylinderSizeAndTypes";

import { QuantityModal, CylinderFilters } from "./index";

export default function GiveCylinderModal({ isOpen, onClose, onSelect }) {
    const storeId = useAuthStore((s) => s.currentStore?.id);

    const [size, setSize] = useState("12");
    const [regulatorType, setRegulatorType] = useState("22");

    // inventory for give (active)
    const {
        data: inventory = [],
        isLoading,
        isError,
    } = useCylinderInventory(storeId, size, regulatorType);

    const [quantityModalOpen, setQuantityModalOpen] = useState(false);
    const [selectedCylinder, setSelectedCylinder] = useState(null);

    const handleCylinderChoose = (item) => {
        setSelectedCylinder({ ...item, size, regulatorType });
        setQuantityModalOpen(true);
    };

    const handleQuantityConfirm = (payload) => {
        // payload contains cylinder, quantity, computedTotal, total, type
        // forward to onSelect -> ExchangeSection will call store.addItem
        onSelect(payload);
        setQuantityModalOpen(false);
        onClose();
    };

    const headers = ["#", "Brand", "Status", "Price", "In stock", "Action"];

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Select Cylinder"
                size="vlg"
            >
                <CylinderFilters
                    sizes={SIZES}
                    regulatorTypes={TYPES}
                    size={size}
                    regulatorType={regulatorType}
                    onSizeChange={setSize}
                    onRegulatorTypeChange={setRegulatorType}
                />

                {isLoading && (
                    <div className="flex h-40 items-center justify-center text-gray-500">
                        Fetching inventory...
                    </div>
                )}

                {isError && (
                    <div className="p-4 text-center text-red-500">
                        Failed to load inventory.
                    </div>
                )}

                {!isLoading && inventory.length > 0 && (
                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {headers.map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {inventory.map((item, index) => {
                                    const status =
                                        item.fullCount > 0
                                            ? "In Stock"
                                            : "Out of Stock";

                                    return (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2 text-sm">
                                                {index + 1}
                                            </td>

                                            <td className="px-4 py-2 text-sm font-medium">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.cylinderImage}
                                                        alt={item.brandName}
                                                        className="h-10 w-10 object-contain"
                                                    />
                                                    <span>
                                                        {item.brandName}
                                                    </span>
                                                </div>
                                            </td>

                                            <td
                                                className={clsx(
                                                    "px-4 py-2 text-sm font-medium",
                                                    item.fullCount > 0
                                                        ? "text-emerald-600"
                                                        : "text-red-500",
                                                )}
                                            >
                                                {status}
                                            </td>

                                            <td className="px-4 py-2 text-sm">
                                                ৳{item.price}
                                            </td>

                                            <td className="px-4 py-2 text-sm">
                                                {item.fullCount}
                                            </td>

                                            <td className="px-4 py-2">
                                                <button
                                                    disabled={
                                                        item.fullCount === 0
                                                    }
                                                    onClick={() =>
                                                        handleCylinderChoose(
                                                            item,
                                                        )
                                                    }
                                                    className={clsx(
                                                        "rounded px-3 py-1 text-sm font-medium transition",
                                                        item.fullCount > 0
                                                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                                            : "cursor-not-allowed bg-gray-200 text-gray-500",
                                                    )}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!isLoading && inventory.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        No cylinders found for this size & type.
                    </div>
                )}
            </Modal>

            <QuantityModal
                isOpen={quantityModalOpen}
                onClose={() => setQuantityModalOpen(false)}
                cylinder={selectedCylinder}
                onDone={handleQuantityConfirm}
                type="give"
            />
        </>
    );
}
