import { useState } from "react";
import { Modal } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDefectedCylinderTransaction } from "../hooks";

export default function DefectedCylinderModal({
    isOpen,
    onClose,
    product,
    selectedSize,
    selectedType,
}) {
    const [count, setCount] = useState("");
    const [action, setAction] = useState("mark");

    const storeId = useAuthStore((s) => s.currentStore?.id);
    const { markDefectedMutation } = useDefectedCylinderTransaction(
        storeId,
        selectedSize,
        selectedType,
        action === "mark",
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!count) return;

        const payload = {
            id: product.id,
            cylinderCount: Number(count),
        };

        markDefectedMutation.mutate(payload, {
            onSuccess: () => {
                onClose();
                setCount("");
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
                disabled={markDefectedMutation.isPending}
                className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 disabled:opacity-70"
            >
                {markDefectedMutation.isPending ? "Updating..." : "Confirm"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <span
                    className={`text-lg font-semibold ${
                        action === "mark"
                            ? "text-yellow-600"
                            : "text-emerald-600"
                    }`}
                >
                    {action === "mark"
                        ? "Mark Problem Cylinders"
                        : "Unmark Problem Cylinders"}
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

                {/* ---------- Cylinder Count ---------- */}
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Cylinder Count
                    </label>
                    <input
                        type="number"
                        min={0}
                        required
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                {/* ---------- Action Buttons ---------- */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                        Action
                    </label>

                    <div className="flex gap-2">
                        {[
                            { key: "mark", label: "Mark as Problem" },
                            { key: "unmark", label: "Unmark Problem" },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setAction(key)}
                                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all duration-200 ${
                                    action === key
                                        ? key === "mark"
                                            ? "bg-red-500 text-white shadow-sm shadow-red-300"
                                            : "bg-emerald-500 text-white shadow-sm shadow-emerald-300"
                                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100"
                                } hover:scale-[1.02] active:scale-[0.99]`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
