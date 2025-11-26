import { useState } from "react";
import {
    GiveCylinderModal,
    BrandSelectionModal,
} from "@/features/common/cylinderSelection";

export default function SwapComposer({ onSubmit }) {
    const [giveList, setGiveList] = useState([]);
    const [takeList, setTakeList] = useState([]);

    const [giveModal, setGiveModal] = useState(false);
    const [takeModal, setTakeModal] = useState(false);

    const handleSubmit = () => {
        // Build a minimal payload for backend
        const payload = {
            postType:
                giveList.length > 0 && takeList.length > 0
                    ? "both"
                    : giveList.length > 0
                      ? "give"
                      : "take",
            offer: giveList,
            take: takeList,
            description: "",
        };

        onSubmit(payload);
        setGiveList([]);
        setTakeList([]);
    };

    return (
        <div className="flex flex-col rounded-md bg-white text-gray-700 shadow-lg ring-1 ring-gray-200">
            {/* Header */}
            <section className="flex items-center justify-between bg-gray-100/90 px-4 py-4">
                <h2 className="text-lg font-semibold text-gray-700">
                    Create Swap Request
                </h2>
            </section>

            {/* Offer */}
            <section className="flex flex-col gap-2 px-6 py-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Offer</h3>
                    <button
                        onClick={() => setGiveModal(true)}
                        className="primary-button px-3 py-1"
                    >
                        Add <span className="ml-1 text-lg font-bold">+</span>
                    </button>
                </div>

                {giveList.length === 0 ? (
                    <span className="text-sm text-gray-400">
                        Nothing added yet.
                    </span>
                ) : (
                    giveList.map((item, i) => (
                        <div
                            key={i}
                            className="rounded border px-3 py-2 text-sm text-gray-700"
                        >
                            {item.brandName ?? item.brand} — {item.size}kg —{" "}
                            {item.regulatorType} — Qty: {item.quantity}
                        </div>
                    ))
                )}
            </section>

            {/* Demand */}
            <section className="flex flex-col gap-2 px-6 py-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Demand</h3>
                    <button
                        onClick={() => setTakeModal(true)}
                        className="primary-button px-3 py-1"
                    >
                        Add <span className="ml-1 text-lg font-bold">+</span>
                    </button>
                </div>

                {takeList.length === 0 ? (
                    <span className="text-sm text-gray-400">
                        Nothing added yet.
                    </span>
                ) : (
                    takeList.map((item, i) => (
                        <div
                            key={i}
                            className="rounded border px-3 py-2 text-sm text-gray-700"
                        >
                            {item.brand?.name ?? item.brandName ?? item.brand} —{" "}
                            {item.size}kg — {item.regulatorType} — Qty:{" "}
                            {item.quantity}
                        </div>
                    ))
                )}
            </section>

            {/* Submit */}
            <section className="mt-4 mb-4 flex items-center justify-center gap-3 px-4">
                <button
                    onClick={handleSubmit}
                    className="primary-button px-3 py-1"
                >
                    Post Swap Request
                </button>
            </section>

            <GiveCylinderModal
                isOpen={giveModal}
                onClose={() => setGiveModal(false)}
                onSelect={(p) => setGiveList((prev) => [...prev, p])}
            />

            <BrandSelectionModal
                isOpen={takeModal}
                onClose={() => setTakeModal(false)}
                onDone={(p) => setTakeList((prev) => [...prev, p])}
            />
        </div>
    );
}
