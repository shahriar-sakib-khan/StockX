import { useState, useMemo, useEffect } from "react";

import { Modal } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCylinderTransaction } from "../hooks";

export default function TransactionModal({
    isOpen,
    onClose,
    isBuyModal,
    type,
    product,
    selectedSize,
    selectedType,
}) {
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const { buyMutation, sellMutation } = useCylinderTransaction(
        storeId,
        selectedSize,
        selectedType,
    );

    const mutation = isBuyModal ? buyMutation : sellMutation;

    const [quantity, setQuantity] = useState("");
    const [total, setTotal] = useState("");
    const [userEditedTotal, setUserEditedTotal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const computedTotal = useMemo(() => {
        if (!quantity) return 0;
        return Number(product.price) * Number(quantity);
    }, [quantity, product.price]);

    // Sync total only if user hasn’t manually overridden it
    useEffect(() => {
        if (!userEditedTotal) setTotal(computedTotal);
    }, [computedTotal, userEditedTotal]);

    const handleTotalChange = (e) => {
        setUserEditedTotal(true);
        setTotal(Number(e.target.value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!quantity) return;

        const payload = {
            id: product.id,
            quantity: Number(quantity),
            price: Number(product.price),
            totalAmount: Number(total),
            paymentMethod,
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                onClose();
                setQuantity("");
                setTotal("");
                setPaymentMethod("cash");
                setUserEditedTotal(false);
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
                disabled={mutation.isPending}
                className={`rounded-md px-4 py-2 text-white disabled:opacity-70 ${
                    isBuyModal
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-emerald-500 hover:bg-emerald-600"
                }`}
            >
                {mutation.isPending
                    ? "Processing..."
                    : isBuyModal
                      ? "Confirm Purchase"
                      : "Confirm Sale"}
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
                        isBuyModal ? "text-red-600" : "text-emerald-600"
                    }`}
                >
                    {isBuyModal ? "Buy Cylinders" : "Sell Cylinders"}
                </span>
            }
            footer={footer}
            size="md"
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* ---------- Brand Info + Cylinder Details ---------- */}
                <div className="mt-2 flex flex-col rounded-md border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={`/src/assets/images/${type.replace(/s$/, "")}Model.png`}
                            alt={product.brandName || product.name || "Brand"}
                            className="h-8 w-8 object-contain"
                        />
                        {product.name === "Double Burner Stove" && (
                            <img
                                src={`/src/assets/images/${type.replace(/s$/, "")}Model.png`}
                                alt={product.brandName || product.name}
                                className="h-6 w-6"
                            />
                        )}
                        <span className="text-sm font-semibold text-gray-700">
                            {product.brandName ||
                                product.name ||
                                "Unknown Brand"}
                        </span>
                    </div>

                    {type === "cylinders" && (
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
                    )}
                </div>

                {/* ---------- Price & Quantity ---------- */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Price (Fixed)
                        </label>
                        <input
                            type="number"
                            value={product.price}
                            readOnly
                            className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-700 outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Quantity
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(
                                    e.target.value < 0 ? 0 : e.target.value,
                                )
                            }
                            required
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                </div>

                {/* ---------- Computed + Editable Total ---------- */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <p className="text-sm text-gray-500 italic">
                        {product.price} × {quantity || 0} ={" "}
                        <span
                            className={`text-base font-semibold ${
                                isBuyModal ? "text-red-600" : "text-emerald-600"
                            }`}
                        >
                            {computedTotal || 0}
                        </span>
                    </p>

                    <div className="w-full sm:w-1/2">
                        <label className="block text-sm font-medium text-gray-600">
                            Total Amount
                        </label>
                        <input
                            type="number"
                            value={total}
                            onChange={handleTotalChange}
                            className={`mt-1 w-full rounded-md border p-2 transition-all outline-none focus:ring-2 ${
                                isBuyModal
                                    ? "border-red-300 focus:ring-red-400"
                                    : "border-emerald-300 focus:ring-emerald-400"
                            }`}
                        />
                    </div>
                </div>

                {/* ---------- Payment Method (Dropdown) ---------- */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                        Payment Method
                    </label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 font-medium text-gray-700 transition-all outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-400"
                    >
                        <option value="cash">💵 Cash</option>
                        <option value="bank">🏦 Bank</option>
                        <option value="mobile">📱 Mobile</option>
                        <option value="due">🕒 Due</option>
                        <option value="other">✨ Other</option>
                    </select>
                </div>
            </form>
        </Modal>
    );
}
