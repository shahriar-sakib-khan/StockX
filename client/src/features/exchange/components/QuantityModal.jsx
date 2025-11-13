import { useState, useEffect, useRef } from "react";

import { Modal } from "@/components";

/**
 * QuantityModal now supports initialQuantity and initialTotal so we can reuse it
 * for editing existing store items as well as adding new ones.
 *
 * Props:
 * - isOpen
 * - onClose
 * - cylinder (full object)
 * - onDone(payload) -> payload contains { cylinder, quantity, computedTotal, total, type, uid? }
 * - type ("give" | "take")
 * - initialQuantity (optional)
 * - initialTotal (optional)
 */
export default function QuantityModal({
    isOpen,
    onClose,
    cylinder,
    onDone,
    type = "give",
    initialQuantity = 0,
    initialTotal = null,
}) {
    // safe guards / fallbacks
    const image = cylinder?.cylinderImage || cylinder?.image || "";
    const price = Number(cylinder?.price) || 0;
    const stock = Number(cylinder?.fullCount ?? cylinder?.stock) || 0;
    const brandName = cylinder?.brandName || cylinder?.name || "Unknown";
    const size = cylinder?.size ?? "";
    const regulatorType = cylinder?.regulatorType ?? "";

    const [quantity, setQuantity] = useState(Number(initialQuantity) || 0);
    const [computedTotal, setComputedTotal] = useState(0);
    const [total, setTotal] = useState(
        initialTotal != null ? Number(initialTotal) : 0,
    );

    const userEditedTotalRef = useRef(false);

    // when modal opens or cylinder/initial values change, initialize state
    useEffect(() => {
        if (isOpen) {
            setQuantity(Number(initialQuantity) || 0);
            setComputedTotal(0);
            setTotal(initialTotal != null ? Number(initialTotal) : 0);
            userEditedTotalRef.current = !!(initialTotal != null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, cylinder]);

    // recalc computedTotal and sync total if user hasn't edited it
    useEffect(() => {
        if (!Number.isFinite(quantity) || quantity <= 0) {
            setComputedTotal(0);
            if (!userEditedTotalRef.current) setTotal(0);
            return;
        }

        const calc = quantity * price;
        setComputedTotal(calc);
        if (!userEditedTotalRef.current) setTotal(calc);
    }, [quantity, price]);

    const handleQuantityChange = (e) => {
        const raw = Number(e.target.value);
        if (Number.isNaN(raw)) {
            setQuantity(0);
            return;
        }
        const val = Math.max(0, Math.min(stock || Infinity, raw));
        setQuantity(val);
    };

    const handleTotalChange = (e) => {
        if (quantity <= 0) return;
        const raw = Number(e.target.value);
        if (Number.isNaN(raw) || raw < 0) {
            setTotal(0);
            return;
        }
        userEditedTotalRef.current = true;
        setTotal(raw);
    };

    const handleAdd = () => {
        if (!cylinder) return;

        onDone({
            uid: cylinder._uid ?? null, // optional - upstream can ignore
            cylinder,
            quantity,
            computedTotal,
            total,
            type,
        });

        // reset local (safe)
        setQuantity(0);
        setComputedTotal(0);
        setTotal(0);
        userEditedTotalRef.current = false;
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                setQuantity(0);
                setTotal(0);
                userEditedTotalRef.current = false;
                onClose();
            }}
            title={type === "give" ? "Give Cylinders" : "Take Cylinders"}
            footer={
                <>
                    <button
                        onClick={() => {
                            setQuantity(0);
                            setTotal(0);
                            onClose();
                        }}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleAdd}
                        className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
                            type === "give"
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        Add
                    </button>
                </>
            }
            size="md"
        >
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                    <img
                        src={image}
                        alt="Cylinder"
                        className="h-10 w-10 object-contain"
                    />
                    <div>
                        <p className="font-semibold text-gray-700">
                            {brandName}
                        </p>
                        <p className="text-sm text-gray-500">
                            {size}L • {regulatorType}mm
                        </p>
                    </div>
                </div>

                <span className="text-sm font-medium text-gray-700">
                    In Stock: {stock}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Price (Fixed)
                    </label>
                    <input
                        type="number"
                        value={price}
                        readOnly
                        className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 p-2 text-gray-700"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Quantity
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-gray-400"
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-sm text-gray-500 italic">
                    {price} × {quantity} ={" "}
                    <span
                        className={`text-base font-semibold ${type === "give" ? "text-emerald-600" : "text-blue-600"}`}
                    >
                        {computedTotal}
                    </span>
                </p>

                <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-600">
                        Total Amount (Editable)
                    </label>
                    <input
                        type="number"
                        value={total}
                        onChange={handleTotalChange}
                        readOnly={quantity <= 0}
                        className={`mt-1 w-full rounded-md border p-2 outline-none focus:ring-2 ${
                            quantity <= 0
                                ? "cursor-not-allowed bg-gray-100"
                                : type === "give"
                                  ? "border-emerald-300 focus:ring-emerald-400"
                                  : "border-blue-300 focus:ring-blue-400"
                        }`}
                    />
                </div>
            </div>
        </Modal>
    );
}
