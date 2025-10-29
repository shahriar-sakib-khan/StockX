export default function BrandHeader({
    allSelected,
    selectedCount,
    totalCount,
    changedCount,
    toggleAll,
    handleSubmit,
}) {
    return (
        <header className="sticky top-0 z-10 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
                Select Brands
            </h2>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                    onClick={toggleAll}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 active:scale-[0.98]"
                >
                    {allSelected ? "Deselect All" : "Select All"}
                </button>

                <span className="text-sm font-medium text-gray-600">
                    Selected:{" "}
                    <span className="text-gray-900">{selectedCount}</span> /{" "}
                    {totalCount}
                </span>

                <button
                    onClick={handleSubmit}
                    disabled={changedCount === 0}
                    className={`rounded-md px-5 py-2 text-sm font-semibold shadow-sm transition-all active:scale-[0.98] ${
                        changedCount > 0
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "cursor-not-allowed bg-gray-200 text-gray-400"
                    }`}
                >
                    Submit ({changedCount})
                </button>
            </div>
        </header>
    );
}
