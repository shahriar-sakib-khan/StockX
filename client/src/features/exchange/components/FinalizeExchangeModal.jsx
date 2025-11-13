import React, { useEffect, useMemo, useRef, useState } from "react";

import { toast } from "sonner";
import { useSingleShop } from "@/features/shop/hooks/shopHooks";
import { useExchangeStore } from "@/stores/useExchangeStore";

import FinalizeExchangeHeader from "../utils/FinalizeExchangeHeader";
import GivenCylinders from "../utils/GivenCylinders";
import TakenCylinders from "../utils/TakenCylinders";
import PaymentExtras from "../utils/PaymentExtras";
import PaymentSummary from "../utils/PaymentSummary";
import PrintStyles from "../utils/PrintStyles";

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

    const hasInitRef = useRef(false);
    const createdAtRef = useRef(null);

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

    const [isPrintNormalization, setIsPrintNormalization] = useState(false);

    useEffect(() => {
        if (!open) {
            hasInitRef.current = false;
            createdAtRef.current = null;
            setIsPrintNormalization(false);
            return;
        }

        if (!hasInitRef.current) {
            createdAtRef.current = new Date();
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
    }, [open]);

    const due = Math.max(0, Number(totalAmount || 0) - Number(paidAmount || 0));

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

    const handleSave = async () => {
        if (!validateTotalAmount(totalAmount)) return;
        if (!validatePaidAmount(paidAmount)) return;

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

    const handlePrint = () => {
        if (!validateTotalAmount(totalAmount)) return;
        if (!validatePaidAmount(paidAmount)) return;

        setIsPrintNormalization(true);

        setTimeout(() => {
            window.print();
            setTimeout(() => {
                setIsPrintNormalization(false);
            }, 200);
        }, 60);
    };

    if (!open) return null;

    const displayTime = createdAtRef.current
        ? createdAtRef.current.toLocaleString()
        : new Date().toLocaleString();

    return (
        <>
            <PrintStyles />

            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-6">
                <div
                    ref={printRef}
                    className="print-area memo-paper w-full max-w-4xl rounded-lg bg-white shadow-xl"
                >
                    <FinalizeExchangeHeader
                        onClose={onClose}
                        displayTime={displayTime}
                    />

                    <div className="px-6 py-6">
                        <GivenCylinders items={giveItems} />
                        <TakenCylinders items={takeItems} />

                        <div className="mt-6 flex gap-4">
                            <div className="w-full basis-1/2">
                                <PaymentExtras
                                    showExtra={showExtra}
                                    setShowExtra={setShowExtra}
                                    refValue={refValue}
                                    setRefValue={setRefValue}
                                    details={details}
                                    setDetails={setDetails}
                                    isPrintNormalization={isPrintNormalization}
                                />
                            </div>

                            <div className="hidden w-px bg-gray-300 lg:block" />

                            <div className="w-full basis-1/2">
                                <PaymentSummary
                                    totals={totals}
                                    sumGiveValue={sumGiveValue}
                                    totalAmount={totalAmount}
                                    setTotalAmount={setTotalAmount}
                                    due={due}
                                    paidAmount={paidAmount}
                                    setPaidAmount={setPaidAmount}
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                    isPrintNormalization={isPrintNormalization}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="no-print mt-6 flex items-center justify-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>

                            <button
                                onClick={handlePrint}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                Print
                            </button>
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            Thank you for your business.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
