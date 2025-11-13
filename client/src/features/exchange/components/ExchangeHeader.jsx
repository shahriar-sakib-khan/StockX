import { toast } from "sonner";

export default function ExchangeHeader({
    totals,
    mutationLoading,
    openFinalizeModal,
}) {
    const handleClick = () => {
        if (totals.giveCount !== totals.takeCount) {
            toast.error("The number of cylinders does not match.");
            return;
        }

        openFinalizeModal();
    };

    return (
        <div className="min-h-[180px] bg-gray-50 p-8">
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
                        onClick={handleClick}
                        disabled={mutationLoading}
                        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {mutationLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}
