export default function PaymentExtras({
    showExtra,
    setShowExtra,
    refValue,
    setRefValue,
    details,
    setDetails,
    isPrintNormalization,
}) {
    return (
        <div>
            <button
                onClick={() => setShowExtra((s) => !s)}
                className="no-print text-sm text-indigo-600 hover:underline"
            >
                {showExtra ? "Hide extra fields" : "Show extra fields"}
            </button>

            {showExtra && (
                <div className="mt-3 space-y-3 border-t pt-3">
                    {/* REF */}
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                            Ref
                        </label>

                        {isPrintNormalization ? (
                            <div className="text-sm">{refValue || "—"}</div>
                        ) : (
                            <input
                                className="w-10/12 rounded-lg border p-2 text-sm"
                                value={refValue}
                                onChange={(e) => setRefValue(e.target.value)}
                            />
                        )}
                    </div>

                    {/* DETAILS */}
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
                                className="w-10/12 rounded-lg border p-2 text-sm"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
