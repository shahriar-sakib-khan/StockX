import { toast } from "sonner";

import { ModalContainer } from "@/components";

import { useAuthStore } from "@/stores/useAuthStore";
import { useExchangeStore } from "@/stores/useExchangeStore";

import { ExchangeSection } from "@/features/exchange/components";
import { useExchangeCylinder } from "@/features/exchange/hooks/useExchangeCylinder";

export default function ExchangePage() {
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const exchangeStore = useExchangeStore();
    const { give, take, reset, getTotals, buildPayload } = exchangeStore;

    const mutation = useExchangeCylinder(storeId, {
        onSuccess: () => {
            toast.success("Exchange submitted successfully.");
            reset();
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to submit exchange.");
        },
    });

    const handleSubmit = () => {
        if (!storeId) {
            toast.error("No store selected.");
            return;
        }
        if (give.length === 0 && take.length === 0) {
            toast.error("Nothing to submit.");
            return;
        }

        const payload = buildPayload(storeId, {
            // additional fields you can collect from UI (vehicleId, payment etc.)
            paymentMethod: "cash",
            paidAmount: 0,
            due: 0,
            details: "Exchange via UI",
            ref: "",
        });

        mutation.mutate(payload);
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

            <ModalContainer />
        </div>
    );
}
