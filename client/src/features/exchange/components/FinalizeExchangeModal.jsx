import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useSingleShop } from "@/features/shop/hooks/shopHooks";
import { useExchangeStore } from "@/stores/useExchangeStore";

export default function FinalizeExchangeModal({
    open,
    onClose,
    payload = {},
    storeId,
    onSave,
}) {
    const exchangeStore = useExchangeStore();
    const { getTotals } = exchangeStore || {};
    const totals = typeof getTotals === "function" ? getTotals() : {};

    const printRef = useRef(null);

    const { data: shop = {} } = useSingleShop(storeId, payload.shopId);

    const giveItems = payload?.cylinders?.give ?? [];
    const takeItems = payload?.cylinders?.take ?? [];

    const totalGiveQty = useMemo(
        () => giveItems.reduce((s, it) => s + (Number(it.quantity) || 0), 0),
        [giveItems],
    );

    const fallbackUnitPrice = useMemo(() => {
        const price = Number(payload?.totalPrice ?? payload?.totalAmount ?? 0);
        return totalGiveQty > 0 ? price / totalGiveQty : 0;
    }, [payload, totalGiveQty]);

    const giveRows = useMemo(
        () =>
            giveItems.map((it) => {
                const qty = Number(it.quantity || 0);
                const unitPrice =
                    (it.price != null && Number(it.price)) ||
                    (it.unitPrice != null && Number(it.unitPrice)) ||
                    fallbackUnitPrice;
                const total = +(unitPrice * qty);
                return { ...it, qty, unitPrice, total };
            }),
        [giveItems, fallbackUnitPrice],
    );

    const sumGiveValue = useMemo(
        () => giveRows.reduce((s, r) => s + r.total, 0),
        [giveRows],
    );

    const takeRows = useMemo(
        () =>
            takeItems.map((it) => ({
                ...it,
                qty: Number(it.quantity || 0),
            })),
        [takeItems],
    );

    // -------------------------
    // Local editable state
    // Initialize once on open to avoid resets on re-renders.
    // -------------------------
    const hasInitRef = useRef(false);
    const createdAtRef = useRef(null); // time of first render (for this open)
    const [totalAmount, setTotalAmount] = useState(() =>
        Number(
            payload?.totalAmount ??
                payload?.totalPrice ??
                totals?.totalAmount ??
                sumGiveValue,
        ),
    );
    const [paidAmount, setPaidAmount] = useState(() =>
        Number(payload?.paidAmount ?? totals?.paidAmount ?? 0),
    );
    const [paymentMethod, setPaymentMethod] = useState(
        payload?.paymentMethod ?? "cash",
    );
    const [refValue, setRefValue] = useState(payload?.ref ?? "");
    const [details, setDetails] = useState(payload?.details ?? "");
    const [showExtra, setShowExtra] = useState(false);
    const [saving, setSaving] = useState(false);

    // print mode / normalization toggles
    const [isPrintNormalization, setIsPrintNormalization] = useState(false);

    // Initialize local state once when modal opens
    useEffect(() => {
        if (!open) {
            // reset for next open
            hasInitRef.current = false;
            createdAtRef.current = null;
            setIsPrintNormalization(false);
            return;
        }

        if (!hasInitRef.current) {
            // capture the "first render" timestamp for this open
            createdAtRef.current = new Date();
            // initialize editable fields from payload/totals/sumGiveValue (only once)
            setTotalAmount(
                Number(
                    payload?.totalAmount ??
                        payload?.totalPrice ??
                        totals?.totalAmount ??
                        sumGiveValue,
                ),
            );
            setPaidAmount(
                Number(payload?.paidAmount ?? totals?.paidAmount ?? 0),
            );
            setPaymentMethod(payload?.paymentMethod ?? "cash");
            setRefValue(payload?.ref ?? "");
            setDetails(payload?.details ?? "");
            hasInitRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]); // only run on open change

    const due = Math.max(0, Number(totalAmount || 0) - Number(paidAmount || 0));

    // ---------- validation ----------
    const validateTotalAmount = (val) => {
        const n = Number(val);
        if (Number.isNaN(n) || n < 0) {
            toast.error("Total amount must be a number ≥ 0.");
            return false;
        }
        return true;
    };

    const validatePaidAmount = (val) => {
        const n = Number(val);
        if (Number.isNaN(n) || n < 0) {
            toast.error("Paid amount must be a number ≥ 0.");
            return false;
        }
        if (n > Number(totalAmount)) {
            toast.error("Paid amount cannot be greater than total amount.");
            return false;
        }
        return true;
    };

    // ---------- save ----------
    const handleSave = async () => {
        if (!validateTotalAmount(totalAmount)) return;
        if (!validatePaidAmount(paidAmount)) return;

        // Use createdAtRef (first render time) as the official timestamp to save
        const finalPayload = {
            ...payload,
            totalAmount: Number(totalAmount),
            paidAmount: Number(paidAmount),
            due: Number(due),
            paymentMethod: paidAmount > 0 ? paymentMethod : "due",
            ref: refValue,
            details,
            receiptCreatedAt: createdAtRef.current
                ? createdAtRef.current.toISOString()
                : new Date().toISOString(),
        };

        try {
            setSaving(true);
            await Promise.resolve(onSave(finalPayload));
            toast.success("Exchange saved.");
            setSaving(false);
            onClose?.();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save exchange.");
            setSaving(false);
        }
    };

    // ---------- print (normalize, print, restore) ----------
    const handlePrint = () => {
        // ensure validation (optional)
        if (!validateTotalAmount(totalAmount)) return;
        if (!validatePaidAmount(paidAmount)) return;

        // Flip to normalized print mode (turn inputs into static text)
        setIsPrintNormalization(true);

        // Give React a moment to render the normalized DOM
        setTimeout(() => {
            // Use createdAtRef as the timestamp used on the printed memo
            // Call browser print
            window.print();

            // After printing, restore editable UI
            // small timeout to ensure printing started
            setTimeout(() => {
                setIsPrintNormalization(false);
            }, 200);
        }, 60);
    };

    // If modal is closed, nothing to render
    if (!open) return null;

    // Format time display from createdAtRef (fall back to current if missing)
    const displayTime = createdAtRef.current
        ? createdAtRef.current.toLocaleString()
        : new Date().toLocaleString();

    return (
        <>
            <style>{`
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 190mm; padding: 8mm; box-sizing: border-box; }
          .no-print { display: none !important; }
          /* hide input borders for print if any remain */
          input, textarea, select { border: none !important; box-shadow: none !important; }
        }

        /* Standard receipt font (monospace for consistent numeric alignment) */
        .memo-paper {
          background: #fff;
          font-family: "Roboto Mono", "Courier New", monospace !important;
          color: #111827;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* small screen tweaks */
        @media (max-width: 640px) {
          .print-area { width: calc(100% - 32px); padding: 12px; }
        }
      `}</style>

            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-6">
                <div
                    ref={printRef}
                    className="print-area memo-paper w-full max-w-4xl rounded-lg bg-white shadow-xl"
                >
                    {/* Header (no-print) */}
                    <div className="no-print flex items-center justify-between border-b px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Finalize Exchange
                        </h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-md px-3 py-1 text-sm hover:bg-gray-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Printable Memo Body */}
                    <div className="px-6 py-6">
                        {/* TOP CENTER: Title + CreatedAt (first render time) */}
                        <div className="mb-4 flex flex-col items-center text-center">
                            <div className="text-2xl font-bold tracking-tight">
                                Gas Exchange Receipt
                            </div>
                            <div className="mt-1 text-xs text-gray-600">
                                {/* Display the first-render time */}
                                {displayTime}
                            </div>
                        </div>

                        {/* Header Blocks: Left (shop), Right (transactor) */}
                        <div className="mb-4 flex items-start justify-between gap-4">
                            {/* Left block */}
                            <div className="w-1/2">
                                <div className="text-sm font-semibold">
                                    {shop?.name ?? "— Shop Name —"}
                                </div>
                                <div className="mt-1 text-xs text-gray-600">
                                    {shop?.location ?? "— Location —"}
                                </div>
                                <div className="mt-0.5 text-xs text-gray-600">
                                    {shop?.phone ?? "— Phone —"}
                                </div>
                            </div>

                            {/* Right block */}
                            <div className="w-1/2 text-right">
                                <div className="text-sm font-medium">
                                    {payload?.transactorName ??
                                        payload?.customerName ??
                                        "— Transactor —"}
                                </div>
                                <div className="mt-1 text-xs text-gray-600">
                                    {payload?.transactorPhone ??
                                        payload?.customerPhone ??
                                        "— Phone —"}
                                </div>
                            </div>
                        </div>

                        {/* Given section header */}
                        <div className="mt-6 mb-2 text-sm font-bold tracking-wider text-gray-700 uppercase">
                            Given Cylinders
                        </div>

                        {/* GIVE rows (unchanged — plain text rows) */}
                        {giveItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 items-center border-b border-gray-200 py-1 text-sm"
                            >
                                <div className="col-span-4 font-medium capitalize">
                                    {item.brand}
                                </div>
                                <div className="col-span-2">
                                    {item.regulatorType}
                                </div>
                                <div className="col-span-2">{item.size}kg</div>
                                <div className="col-span-1">
                                    {item.quantity}
                                </div>
                                <div className="col-span-1 text-right">
                                    {Number(item.price).toLocaleString()}
                                </div>
                                <div className="col-span-2 text-right font-semibold">
                                    {Number(
                                        item.price * item.quantity,
                                    ).toLocaleString()}
                                </div>
                            </div>
                        ))}

                        {/* Taken section header */}
                        <div className="mt-6 mb-2 text-sm font-bold tracking-wider text-gray-700 uppercase">
                            Taken Cylinders
                        </div>

                        {takeItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 items-center border-b border-gray-200 py-1 text-sm"
                            >
                                <div className="col-span-4 font-medium capitalize">
                                    {item.brand}
                                </div>
                                <div className="col-span-2">
                                    {item.regulatorType}
                                </div>
                                <div className="col-span-2">{item.size}kg</div>
                                <div className="col-span-1">
                                    {item.quantity}
                                </div>
                            </div>
                        ))}

                        <hr className="my-4 border-gray-300" />

                        {/* Payment summary area: left extras | divider | right totals */}
                        <div className="flex items-start gap-4">
                            {/* LEFT: Extras (collapsible) */}
                            <div className="w-1/3">
                                <button
                                    onClick={() => setShowExtra((s) => !s)}
                                    className="no-print text-sm text-indigo-600 hover:underline"
                                >
                                    {showExtra
                                        ? "Hide extra fields"
                                        : "Show extra fields"}
                                </button>

                                {showExtra && (
                                    <div className="mt-2 space-y-2">
                                        {/* For print: render plain text instead of inputs if isPrintNormalization */}
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                                Ref
                                            </label>
                                            {isPrintNormalization ? (
                                                <div className="text-sm">
                                                    {refValue || "—"}
                                                </div>
                                            ) : (
                                                <input
                                                    value={refValue}
                                                    onChange={(e) =>
                                                        setRefValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border p-2 text-sm"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                                Details
                                            </label>
                                            {isPrintNormalization ? (
                                                <div className="text-sm whitespace-pre-wrap">
                                                    {details || "—"}
                                                </div>
                                            ) : (
                                                <textarea
                                                    rows={3}
                                                    value={details}
                                                    onChange={(e) =>
                                                        setDetails(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border p-2 text-sm"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* MIDDLE divider */}
                            <div
                                className="w-px bg-gray-200"
                                style={{ minHeight: 140 }}
                            />

                            {/* RIGHT: Totals & payment */}
                            <div className="flex-1">
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Total Price (readonly) */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Total Price
                                        </label>
                                        {isPrintNormalization ? (
                                            <div className="w-40 text-right font-semibold">
                                                {Number(
                                                    totals?.totalPrice ??
                                                        sumGiveValue,
                                                ).toLocaleString()}
                                            </div>
                                        ) : (
                                            <input
                                                readOnly
                                                value={Number(
                                                    totals?.totalPrice ??
                                                        sumGiveValue,
                                                ).toLocaleString()}
                                                className="w-40 cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-right text-sm font-semibold opacity-80"
                                            />
                                        )}
                                    </div>

                                    {/* Total Amount (editable) */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Total Amount
                                        </label>
                                        {isPrintNormalization ? (
                                            <div className="w-40 text-right font-semibold">
                                                {Number(
                                                    totalAmount,
                                                ).toLocaleString()}
                                            </div>
                                        ) : (
                                            <input
                                                type="number"
                                                min="0"
                                                value={totalAmount}
                                                onChange={(e) =>
                                                    setTotalAmount(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-40 rounded-md border border-blue-400 bg-white px-2 py-1 text-right text-sm font-semibold shadow-sm focus:ring-2 focus:ring-blue-300"
                                            />
                                        )}
                                    </div>

                                    {/* Due (readonly) */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Due
                                        </label>
                                        {isPrintNormalization ? (
                                            <div className="w-40 text-right font-semibold">
                                                {Number(due).toLocaleString()}
                                            </div>
                                        ) : (
                                            <input
                                                readOnly
                                                value={Number(
                                                    due,
                                                ).toLocaleString()}
                                                className="w-40 cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-right text-sm font-semibold opacity-80"
                                            />
                                        )}
                                    </div>

                                    {/* Paid (editable) */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Paid
                                        </label>
                                        {isPrintNormalization ? (
                                            <div className="w-40 text-right font-semibold">
                                                {Number(
                                                    paidAmount,
                                                ).toLocaleString()}
                                            </div>
                                        ) : (
                                            <input
                                                type="number"
                                                min="0"
                                                value={paidAmount}
                                                onChange={(e) =>
                                                    setPaidAmount(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-40 rounded-md border border-blue-400 bg-white px-2 py-1 text-right text-sm font-semibold shadow-sm focus:ring-2 focus:ring-blue-300"
                                            />
                                        )}
                                    </div>

                                    {/* Payment method */}
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium whitespace-nowrap text-gray-700">
                                                Payment Method
                                            </label>
                                            {isPrintNormalization ? (
                                                <div className="text-sm">
                                                    {paymentMethod}
                                                </div>
                                            ) : (
                                                <select
                                                    value={paymentMethod}
                                                    onChange={(e) =>
                                                        setPaymentMethod(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-400"
                                                >
                                                    <option value="cash">
                                                        💵 Cash
                                                    </option>
                                                    <option value="bank">
                                                        🏦 Bank
                                                    </option>
                                                    <option value="mobile">
                                                        📱 Mobile
                                                    </option>
                                                    <option value="due">
                                                        🕒 Due
                                                    </option>
                                                    <option value="other">
                                                        ✨ Other
                                                    </option>
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            Thank you for your business.
                        </div>
                    </div>

                    {/* Modal Footer (no-print) */}
                    <div className="no-print flex items-center justify-end gap-3 border-t px-6 py-3">
                        <button
                            onClick={onClose}
                            className="rounded-md px-3 py-1 text-sm hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save & Close"}
                        </button>

                        <button
                            onClick={handlePrint}
                            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
