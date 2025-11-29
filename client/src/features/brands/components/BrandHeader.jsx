import { FaCheckDouble, FaSave } from "react-icons/fa";

export default function BrandHeader({
    allSelected,
    selectedCount,
    totalCount,
    changedCount,
    toggleAll,
    handleSubmit,
    isLoading = false, // Received from parent
}) {
    return (
        <header className="sticky top-0 z-20 flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center">
            {/* Title & Count */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                    Select Brands
                </h2>
                <p className="text-sm text-gray-500">
                    Selected: <span className="font-medium text-indigo-600">{selectedCount}</span> / {totalCount}
                </p>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Select All Button */}
                <button
                    onClick={toggleAll}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 active:scale-95 sm:text-sm"
                >
                    <FaCheckDouble className={allSelected ? "text-indigo-500" : "text-gray-400"} />
                    {allSelected ? "Deselect All" : "Select All"}
                </button>

                {/* Submit / Save Button */}
                <button
                    onClick={handleSubmit}
                    disabled={changedCount === 0 || isLoading}
                    className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold shadow-sm transition-all active:scale-95 ${
                        changedCount > 0
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md"
                            : "cursor-not-allowed bg-gray-100 text-gray-400"
                    }`}
                >
                    {isLoading ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <FaSave />
                            <span>Save Changes {changedCount > 0 && `(${changedCount})`}</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
}
