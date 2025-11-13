export default function PaymentSummary({
    totals,
    sumGiveValue,
    totalAmount,
    setTotalAmount,
    due,
    paidAmount,
    setPaidAmount,
    paymentMethod,
    setPaymentMethod,
    isPrintNormalization,
}) {
    return (
        <div className="flex-1">
            <div className="grid grid-cols-1 gap-4">
                {/* Total Price */}
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        Total Price
                    </label>
                    {isPrintNormalization ? (
                        <div className="w-40 text-right font-semibold">
                            {Number(
                                totals?.totalPrice ?? sumGiveValue,
                            ).toLocaleString()}
                        </div>
                    ) : (
                        <input
                            readOnly
                            className="w-40 cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-right text-sm font-semibold opacity-80"
                            value={Number(
                                totals?.totalPrice ?? sumGiveValue,
                            ).toLocaleString()}
                        />
                    )}
                </div>

                {/* Total Amount */}
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        Total Amount
                    </label>
                    {isPrintNormalization ? (
                        <div className="w-40 text-right font-semibold">
                            {Number(totalAmount).toLocaleString()}
                        </div>
                    ) : (
                        <input
                            type="number"
                            min="0"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            className="w-40 rounded-md border border-blue-400 bg-white px-2 py-1 text-right text-sm font-semibold shadow-sm focus:ring-2 focus:ring-blue-300"
                        />
                    )}
                </div>

                {/* Due */}
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
                            className="w-40 cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-right text-sm font-semibold opacity-80"
                            value={Number(due).toLocaleString()}
                        />
                    )}
                </div>

                {/* Paid */}
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        Paid
                    </label>
                    {isPrintNormalization ? (
                        <div className="w-40 text-right font-semibold">
                            {Number(paidAmount).toLocaleString()}
                        </div>
                    ) : (
                        <input
                            type="number"
                            min="0"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                            className="w-40 rounded-md border border-blue-400 bg-white px-2 py-1 text-right text-sm font-semibold shadow-sm focus:ring-2 focus:ring-blue-300"
                        />
                    )}
                </div>

                {/* Method */}
                <div className="mt-2 flex items-center justify-between">
                    <label className="block text-sm font-medium whitespace-nowrap text-gray-700">
                        Payment Method
                    </label>
                    {isPrintNormalization ? (
                        <div className="text-sm">{paymentMethod}</div>
                    ) : (
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-400"
                        >
                            <option value="cash">💵 Cash</option>
                            <option value="bank">🏦 Bank</option>
                            <option value="mobile">📱 Mobile</option>
                            <option value="due">🕒 Due</option>
                            <option value="other">✨ Other</option>
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
}
