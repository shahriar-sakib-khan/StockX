import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { FaStore } from "react-icons/fa";

export default function ShopProfile() {
    const currentStore = useAuthStore((s) => s.currentStore);

    // Skeleton / Loading State
    if (!currentStore) {
        return (
            <div className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex flex-col gap-1">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-3 w-20 rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    const { image, name, phone, location } = currentStore;
    const initial = name ? name.charAt(0).toUpperCase() : "?";

    return (
        <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                <div
                    className="hidden h-full w-full items-center justify-center bg-gray-100 text-gray-400"
                    style={{ display: image ? 'none' : 'flex' }}
                >
                    <FaStore />
                </div>
            </div>

            <div className="hidden min-w-0 flex-col sm:flex">
                <div className="truncate text-sm font-bold text-gray-800">
                    {name}
                </div>
                <div className="truncate text-xs text-gray-500">
                    {location}
                </div>
            </div>
        </div>
    );
}
