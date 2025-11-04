import { ModalContainer } from "@/components";

export default function ShopTransactionModal({
    isOpen,
    onClose,
    transactionType = "clear_due", // "clear_due" or "exchange"
    shop,
    transactionData,
    handleTransactionChange,
    handleTransactionSubmit,
    isRecording,
}) {
    return (
        <ModalContainer
            backdropColor="bg-black/50"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-600">
                    {transactionType === "exchange"
                        ? `Exchange / Sale for ${shop?.shopName || "Shop"}`
                        : `Clear Due for ${shop?.shopName || "Shop"}`}
                </h3>

                <form
                    onSubmit={handleTransactionSubmit}
                    className="flex flex-col gap-3"
                >
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-600">
                            Amount
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={transactionData.amount}
                            onChange={handleTransactionChange}
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-600">
                            Payment Method
                        </label>
                        <select
                            name="paymentMethod"
                            value={transactionData.paymentMethod}
                            onChange={handleTransactionChange}
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="cash">Cash</option>
                            <option value="bank">Bank</option>
                            <option value="mobile">Mobile</option>
                            <option value="due">Due</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-600">
                            Reference
                        </label>
                        <input
                            type="text"
                            name="ref"
                            value={transactionData.ref}
                            onChange={handleTransactionChange}
                            placeholder="Invoice / Voucher No"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-600">
                            Details
                        </label>
                        <input
                            type="text"
                            name="details"
                            value={transactionData.details}
                            onChange={handleTransactionChange}
                            placeholder="Optional details"
                            className="flex-1 rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isRecording}
                            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                        >
                            {isRecording
                                ? "Recording..."
                                : transactionType === "exchange"
                                  ? "Record Exchange"
                                  : "Record"}
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
}
