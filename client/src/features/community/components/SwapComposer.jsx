import { useState } from "react";
import { FaPlus, FaPaperPlane } from "react-icons/fa";
import {
    GiveCylinderModal,
    BrandSelectionModal,
} from "@/features/common/cylinderSelection";
import CylinderItemCard from "./CylinderItemCard"; // Reuse the nice card!

export default function SwapComposer({ onSubmit }) {
    const [giveList, setGiveList] = useState([]);
    const [takeList, setTakeList] = useState([]);
    const [description, setDescription] = useState("");

    const [giveModal, setGiveModal] = useState(false);
    const [takeModal, setTakeModal] = useState(false);

    const handleSubmit = () => {
        if (giveList.length === 0 && takeList.length === 0) return;

        const payload = {
            postType: giveList.length > 0 && takeList.length > 0
                    ? "both"
                    : giveList.length > 0 ? "give" : "take",
            offer: giveList,
            take: takeList,
            description,
        };

        onSubmit(payload);
        setGiveList([]);
        setTakeList([]);
        setDescription("");
    };

    return (
        <div className="flex flex-col rounded-xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-800">Create Swap Request</h2>
                <p className="text-xs text-gray-500">Post what you have and what you need.</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Description Input */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Note (Optional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Any specific details? e.g., 'Need urgent delivery by 5 PM'"
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        rows="2"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* OFFER SECTION */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-600">Offering</h3>
                            <button
                                onClick={() => setGiveModal(true)}
                                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
                            >
                                <FaPlus /> Add Item
                            </button>
                        </div>

                        <div className="min-h-[100px] rounded-lg border-2 border-dashed border-emerald-100 bg-emerald-50/30 p-3">
                            {giveList.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-xs text-gray-400">
                                    <p>No items added.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {giveList.map((item, i) => (
                                        <div key={i} className="relative group">
                                            <CylinderItemCard item={item} variant="offer" />
                                            {/* Remove Button */}
                                            <button
                                                onClick={() => setGiveList(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm group-hover:flex"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DEMAND SECTION */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-orange-600">Requesting</h3>
                            <button
                                onClick={() => setTakeModal(true)}
                                className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-800 hover:underline"
                            >
                                <FaPlus /> Add Item
                            </button>
                        </div>

                        <div className="min-h-[100px] rounded-lg border-2 border-dashed border-orange-100 bg-orange-50/30 p-3">
                            {takeList.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-xs text-gray-400">
                                    <p>No items added.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {takeList.map((item, i) => (
                                        <div key={i} className="relative group">
                                            <CylinderItemCard item={item} variant="take" />
                                            <button
                                                onClick={() => setTakeList(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm group-hover:flex"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={giveList.length === 0 && takeList.length === 0}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaPaperPlane /> Post Request
                </button>
            </div>

            {/* Modals */}
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
