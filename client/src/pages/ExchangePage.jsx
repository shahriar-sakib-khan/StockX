import { useState } from "react";
import { toast } from "sonner";

import { ModalContainer } from "@/components";

import { useAuthStore } from "@/stores/useAuthStore";
import { useExchangeStore } from "@/stores/useExchangeStore";
import { useExchangeCylinder } from "@/features/exchange/hooks/useExchangeCylinder";

import { ExchangeSection, FinalizeExchangeModal } from "@/features/exchange/components";

export default function ExchangePage() {
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const exchangeStore = useExchangeStore();
    const { give, take, reset, getTotals, buildPayload } = exchangeStore;

    const [finalizeOpen, setFinalizeOpen] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null);

    // mutation
    const mutation = useExchangeCylinder(storeId, {
        onSuccess: () => {
            toast.success("Exchange submitted successfully.");
            reset();
            setFinalizeOpen(false);
            setPendingPayload(null);
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to submit exchange.");
        },
    });

    // Submit → build payload → open Finalize Modal
    const handleSubmit = () => {
        if (!storeId) {
            toast.error("No store selected.");
            return;
        }
        if (give.length === 0 && take.length === 0) {
            toast.error("Nothing to submit.");
            return;
        }

        // build initial payload
        const payload = buildPayload(storeId, {
            paymentMethod: "cash",
            paidAmount: 0,
            due: 0,
            details: "",
            ref: "",
        });

        setPendingPayload(payload);
        setFinalizeOpen(true); // Open modal instead of submitting
    };

    // ---------------------------------------------------------
    //  When modal click “Save Exchange”
    // ---------------------------------------------------------
    const handleSave = (finalPayload) => {
        mutation.mutate(finalPayload);
    };

    const totals = getTotals();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="mb-6 text-center text-3xl font-semibold text-gray-800">
                Exchange Page
            </h1>

            <div className="mb-6 flex items-center justify-center gap-4">
                <div className="rounded-lg bg-white px-4 py-2 shadow">
                    <div className="text-sm text-gray-500">Give items</div>
                    <div className="text-lg font-semibold text-emerald-600">
                        {totals.giveCount}
                    </div>
                </div>

                <div className="rounded-lg bg-white px-4 py-2 shadow">
                    <div className="text-sm text-gray-500">Take items</div>
                    <div className="text-lg font-semibold text-blue-600">
                        {totals.takeCount}
                    </div>
                </div>

                <div className="ml-6">
                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isLoading}
                        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {mutation.isLoading
                            ? "Submitting..."
                            : "Submit Exchange"}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                <ExchangeSection type="give" />
                <ExchangeSection type="take" />
            </div>

            {/* Modal container (existing) */}
            <ModalContainer />

            {/* NEW: Our Finalization Modal */}
            {finalizeOpen && (
                <FinalizeExchangeModal
                    open={finalizeOpen}
                    onClose={() => setFinalizeOpen(false)}
                    payload={pendingPayload}
                    storeId={storeId}
                    onSave={handleSave} // mutation handler
                />
            )}
        </div>
    );
}
