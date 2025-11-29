import clsx from "clsx";

export default function CylinderFilters({
    sizes,
    types,
    selectedSize,
    selectedRegulatorType,
    onSizeChange,
    onTypeChange,
}) {
    return (
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {/* Size Filter */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Size:</span>
                <div className="flex flex-wrap gap-1">
                    {sizes.map((s) => (
                        <button
                            key={s}
                            onClick={() => onSizeChange(String(s))}
                            className={clsx(
                                "rounded px-2 py-1 text-xs font-semibold transition-all",
                                selectedSize === String(s)
                                    ? "bg-emerald-500 text-white shadow-sm"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <div className="flex gap-1">
                    {types.map((t) => (
                        <button
                            key={t}
                            onClick={() => onTypeChange(t)}
                            className={clsx(
                                "rounded px-2 py-1 text-xs font-semibold transition-all",
                                selectedRegulatorType === t
                                    ? "bg-indigo-500 text-white shadow-sm"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                            )}
                        >
                            {t}mm
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
