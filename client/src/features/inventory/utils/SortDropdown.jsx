import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

/**
 * SortBy Component
 * -----------------
 * Props:
 * - sortBy: string (current sort key)
 * - sortOrder: 'asc' | 'desc'
 * - onChange: (newKey: string) => void
 * - onToggleOrder: () => void
 */
export default function SortBy({ sortBy, sortOrder, onChange, onToggleOrder }) {
    const options = [
        { value: "name", label: "Name" },
        { value: "full", label: "Full Count" },
        { value: "empty", label: "Empty Count" },
        { value: "problem", label: "Problem Count" },
    ];

    return (
        <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
                value={sortBy}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        Sort by {opt.label}
                    </option>
                ))}
            </select>

            {/* Asc/Desc Toggle Button */}
            <button
                onClick={onToggleOrder}
                className={`flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 font-medium transition-all dark:border-gray-700 ${
                    sortOrder === "asc"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                } `}
                title={`Toggle to ${sortOrder === "asc" ? "descending" : "ascending"} order`}
            >
                {sortOrder === "asc" ? (
                    <>
                        <ArrowUpAZ size={16} /> Asc
                    </>
                ) : (
                    <>
                        <ArrowDownAZ size={16} /> Desc
                    </>
                )}
            </button>
        </div>
    );
}
