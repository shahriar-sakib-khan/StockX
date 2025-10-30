import { useState } from "react";
import { Modal } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEditCylinderPrice } from "../hooks";

export default function EditPriceModal({
    isOpen,
    onClose,
    product,
    selectedSize,
    selectedType,
}) {
    const [price, setPrice] = useState("");
    const storeId = useAuthStore((s) => s.currentStore?.id);

    const { editPriceMutation } = useEditCylinderPrice(
        storeId,
        selectedSize,
        selectedType,
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!price) return;

        const payload = {
            id: product.id,
            price: Number(price),
        };

        editPriceMutation.mutate(payload, {
            onSuccess: () => {
                onClose();
                setPrice("");
            },
        });
    };

    const footer = (
        <>
            <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={editPriceMutation.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
            >
                {editPriceMutation.isPending ? "Updating..." : "Confirm"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <span className="text-lg font-semibold text-blue-600">
                    Edit Cylinder Price
                </span>
            }
            footer={footer}
            size="md"
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* ---------- Cylinder Info ---------- */}
                <div className="mt-2 flex flex-col rounded-md border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                product.cylinderImage ||
                                `/src/assets/images/${selectedType?.replace(/s$/, "")}Model.png`
                            }
                            alt={product.brandName || product.name}
                            className="h-8 w-8 object-contain"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                            {product.brandName || product.name}
                        </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600 sm:mt-0">
                        <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
                            Size:{" "}
                            <span className="font-medium text-gray-800">
                                {selectedSize || "N/A"}L
                            </span>
                        </span>
                        <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
                            Regulator:{" "}
                            <span className="font-medium text-gray-800">
                                {selectedType || "N/A"}
                            </span>
                        </span>
                    </div>
                </div>

                {/* ---------- Previous Price ---------- */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">
                        Previous Price
                    </label>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
                        {product.price || "N/A"} ৳
                    </div>
                </div>

                {/* ---------- New Price Input ---------- */}
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        New Price
                    </label>
                    <input
                        type="number"
                        min={0}
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </form>
        </Modal>
    );
}
