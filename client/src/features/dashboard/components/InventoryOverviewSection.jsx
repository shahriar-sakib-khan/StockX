import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaPlus } from "react-icons/fa";
import { CylinderTable } from "@/features"; // Imports the robust table wrapper we made earlier

export default function InventoryOverviewSection() {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm border-t-4 border-t-emerald-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2 text-gray-800">
                    <FaBoxOpen className="text-emerald-500 text-lg" />
                    <h3 className="font-bold text-lg">Inventory Overview</h3>
                </div>

                {/* Redirects to Inventory Page */}
                <button
                    onClick={() => navigate("/inventory")}
                    className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100"
                >
                    <FaPlus size={10} /> Add Stock
                </button>
            </div>

            <div className="flex flex-1 flex-col p-5">
                {/* We reuse CylinderTable with 'overview={true}'.
                   It handles displaying the first 3 items efficiently
                   using the logic we built in the previous step
                   (Cards on mobile, Table on desktop).
                */}
                <CylinderTable overview={true} itemCount={3} type="cylinders" />

                <button
                    onClick={() => navigate("/inventory")}
                    className="mt-4 w-full rounded-lg bg-gray-50 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                    View Full Inventory &rarr;
                </button>
            </div>
        </div>
    );
}
