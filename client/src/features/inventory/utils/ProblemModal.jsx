// src/features/cylinders/components/EditModal.jsx
import { useState } from "react";
import { Modal } from "@/components";

export default function EditModal({
    isOpen,
    onClose,
    product,
    type,
    selectedSize,
    selectedType,
}) {
    const [price, setPrice] = useState(product.price ?? "");
    const [status, setStatus] = useState(product.status ?? "In Stock");

    const handleSave = () => {
        // You can connect this to an API later
        console.log("Updated product:", { ...product, price, status });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <span className="text-lg font-semibold text-yellow-600">
                    Edit {product.name}
                </span>
            }
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                    >
                        Save Changes
                    </button>
                </>
            }
            size="md"
        >
            <div className="flex flex-col gap-5">
                {/* Product Info */}
                <div className="flex items-center gap-3">
                    <img
                        src={`/src/assets/images/${type.replace(/s$/, "")}Model.png`}
                        alt={product.brandName || product.name}
                        className="h-10 w-10 object-contain"
                    />
                    <div>
                        <h2 className="text-md font-semibold text-gray-800">
                            {product.brandName || product.name}
                        </h2>
                        {type === "cylinders" && (
                            <p className="text-sm text-gray-600">
                                {selectedSize}L — {selectedType}
                            </p>
                        )}
                    </div>
                </div>

                {/* Editable Fields */}
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Price
                    </label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        <option>In Stock</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
}
