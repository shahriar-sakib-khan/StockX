import { ChevronDown, ChevronUp } from "lucide-react";

export default function SortBy({ sortBy, setSortBy, sortOrder, setSortOrder }) {
    const sortOptions = [
        { value: "name", label: "Name" },
        { value: "full", label: "Full Cylinder Count" },
        { value: "empty", label: "Empty Cylinder Count" },
        { value: "defected", label: "Defected Cylinder Count" },
    ];

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div className="flex items-center gap-3">
            {/* Label */}
            <span className="text-sm font-medium text-gray-600">Sort by:</span>

            {/* Compact Dropdown */}
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[110px] rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm shadow-sm transition-all hover:border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500"
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Sort Order Toggle */}
            <button
                onClick={toggleSortOrder}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm transition-all duration-200 ${
                    sortOrder === "asc"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-600 hover:scale-[1.03] hover:bg-emerald-100"
                        : "border-gray-300 bg-gray-50 text-gray-600 hover:scale-[1.03] hover:bg-gray-100"
                }`}
                title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
                {sortOrder === "asc" ? (
                    <>
                        <ChevronUp size={16} />
                        <span>ASC</span>
                    </>
                ) : (
                    <>
                        <ChevronDown size={16} />
                        <span>DESC</span>
                    </>
                )}
            </button>
        </div>
    );
}
