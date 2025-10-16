import clsx from "clsx";

export default function CylinderFilters({
    sizes,
    types,
    selectedSize,
    selectedType,
    onSizeChange,
    onTypeChange,
}) {
    return (
        <div className="flex items-center gap-8">
            {/* ----------------- Sizes ----------------- */}
            <div
                className={clsx(
                    "ml-auto flex items-center gap-2 transition-all",
                )}
            >
                <h2 className="text-gray-600">Size:</h2>
                {sizes.map((s) => (
                    <button
                        key={s}
                        onClick={() => onSizeChange(String(s))}
                        className={clsx(
                            "rounded border px-3 py-1 text-sm font-medium transition-colors duration-150",
                            selectedSize === String(s)
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
                        )}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* ----------------- Types ----------------- */}
            <div
                className={clsx(
                    "ml-auto flex items-center gap-2 transition-all",
                )}
            >
                <h2 className="text-gray-600">Type:</h2>
                {types.map((t) => (
                    <button
                        key={t}
                        onClick={() => onTypeChange(t)}
                        className={clsx(
                            "rounded border px-3 py-1 text-sm font-medium transition-colors duration-150",
                            selectedType === t
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
    );
}
