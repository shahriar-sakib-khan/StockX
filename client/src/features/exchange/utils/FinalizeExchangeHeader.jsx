export default function FinalizeExchangeHeader({ onClose, displayTime }) {
    return (
        <>
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

            <div className="mb-4 flex flex-col items-center text-center">
                <div className="text-2xl font-bold tracking-tight">
                    Gas Exchange Receipt
                </div>
                <div className="mt-1 text-xs text-gray-600">{displayTime}</div>
            </div>
        </>
    );
}
