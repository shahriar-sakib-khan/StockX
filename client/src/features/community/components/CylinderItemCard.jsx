import React from "react";
import { FaDatabase } from "react-icons/fa"; // Visual proxy for Cylinder

export default function CylinderItemCard({ item = {}, variant = "offer" }) {
    const isOffer = variant === "offer";

    // Theme Config
    const theme = isOffer
        ? { bg: "bg-white", border: "border-emerald-200", text: "text-emerald-900", subtext: "text-emerald-600/80", icon: "text-emerald-200", badge: "bg-emerald-600 text-white" }
        : { bg: "bg-white", border: "border-orange-200", text: "text-orange-900", subtext: "text-orange-600/80", icon: "text-orange-200", badge: "bg-orange-600 text-white" };

    return (
        <div className={`relative flex w-full items-center gap-3 rounded-lg border ${theme.border} ${theme.bg} p-2 shadow-sm transition-transform hover:-translate-y-0.5`}>

            {/* Image / Icon Area */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-50 border border-gray-100 overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.brand}
                        className="h-full w-full object-contain"
                    />
                ) : (
                    // Cylinder Icon Fallback
                    <FaDatabase className={`text-xl ${theme.icon}`} />
                )}
            </div>

            {/* Info Area */}
            <div className="min-w-0 flex-1 flex flex-col justify-center">
                <div className={`truncate text-sm font-bold ${theme.text}`}>
                    {item.brandName || item.brand || "Cylinder"}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${theme.subtext}`}>
                    <span>{item.size}kg</span>
                    <span>•</span>
                    <span>{item.regulatorType}mm</span>
                </div>
            </div>

            {/* Quantity Badge */}
            <div className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm ring-2 ring-white ${theme.badge}`}>
                {item.quantity}
            </div>
        </div>
    );
}
