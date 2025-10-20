import { useState } from "react";
import { Modal } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCylinderTransaction } from "../hooks";

export default function DefectModal({ isOpen, onClose, product }) {
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const { markDefectedMutation, unmarkDefectedMutation } =
        useCylinderTransaction(storeId);

    const [quantity, setQuantity] = useState("");
    const [action, setAction] = useState("mark"); // mark or unmark

    const mutation =
        action === "mark" ? markDefectedMutation : unmarkDefectedMutation;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!quantity) return;

        const payload = {
            id: product.id,
            quantity: Number(quantity),
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                onClose();
                setQuantity("");
                setAction("mark");
            },
        });
    };

    const footer = (
        <>
            <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className={`rounded-md px-4 py-2 text-white disabled:opacity-70 ${
                    action === "mark"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
                {mutation.isPending
                    ? "Processing..."
                    : action === "mark"
                      ? "Mark Defected"
                      : "Unmark Defected"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <span
                    className={`text-lg font-semibold ${
                        action === "mark" ? "text-amber-600" : "text-blue-600"
                    }`}
                >
                    {action === "mark"
                        ? "Mark Defected Cylinders"
                        : "Unmark Defected Cylinders"}
                </span>
            }
            footer={footer}
            size="sm"
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Quantity
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(e.target.value < 0 ? 0 : e.target.value)
                        }
                        required
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                        Action
                    </label>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-amber-400"
                    >
                        <option value="mark">Mark as Defected</option>
                        <option value="unmark">Unmark as Defected</option>
                    </select>
                </div>
            </form>
        </Modal>
    );
}
