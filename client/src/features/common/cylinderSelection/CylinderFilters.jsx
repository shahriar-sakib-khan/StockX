import clsx from "clsx";

export default function CylinderFilters({
    sizes = [],
    regulatorTypes = [],
    size,
    regulatorType,
    onSizeChange,
    onRegulatorTypeChange,
}) {
    return (
        <div className="flex flex-wrap items-center gap-6">
            {/* ----------------- Sizes ----------------- */}
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-gray-600">Size:</h2>

                {sizes.map((s) => (
                    <button
                        key={s}
                        onClick={() => onSizeChange(s)}
                        className={clsx(
                            "rounded border px-3 py-1 text-sm font-medium transition-colors",
                            size === s
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
                        )}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* ----------------- Regulator Types ----------------- */}
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-gray-600">Type:</h2>

                {regulatorTypes.map((t) => (
                    <button
                        key={t}
                        onClick={() => onRegulatorTypeChange(t)}
                        className={clsx(
                            "rounded border px-3 py-1 text-sm font-medium transition-colors",
                            regulatorType === t
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
