import React, { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function BrandCard({ brand, isActive, changed, onToggle }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            onClick={() => onToggle(brand.id)}
            role="checkbox"
            aria-checked={isActive}
            className={`group relative flex cursor-pointer flex-col items-center justify-between overflow-hidden rounded-xl border-2 p-3 transition-all duration-200 active:scale-[0.98] ${
                isActive
                    ? "border-emerald-500 bg-emerald-50 shadow-sm ring-1 ring-emerald-500" // Active styling
                    : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md" // Inactive styling
            }`}
        >
            {/* Image Container */}
            <div className="flex h-16 w-full items-center justify-center rounded-lg bg-white p-2">
                {!imgError && brand.brandImage ? (
                    <img
                        src={brand.brandImage}
                        alt={brand.name}
                        onError={() => setImgError(true)}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    // Fallback if image fails or doesn't exist: Show Initials
                    <div className="flex h-full w-full items-center justify-center rounded bg-gray-100 text-lg font-bold text-gray-400">
                        {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                )}
            </div>

            {/* Brand Name */}
            <div className="mt-3 flex w-full flex-col items-center justify-center text-center">
                <span
                    className={`line-clamp-2 text-sm font-semibold transition-colors ${
                        isActive ? "text-emerald-900" : "text-gray-700"
                    }`}
                >
                    {brand.name}
                </span>
            </div>

            {/* "Changed" Indicator Badge */}
            {changed && (
                <div
                    className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-all ${
                        isActive ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                    }`}
                    title={isActive ? "Pending Selection" : "Pending Deselection"}
                >
                    {isActive ? (
                        <FaCheck className="text-[10px]" />
                    ) : (
                        <FaTimes className="text-[10px]" />
                    )}
                </div>
            )}

            {/* Visual Border Overlay for 'Active' state (Optional polish) */}
            {isActive && !changed && (
                 <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500"></div>
            )}
        </div>
    );
}
