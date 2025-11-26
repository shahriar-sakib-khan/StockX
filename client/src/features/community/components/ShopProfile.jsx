import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ShopProfile() {
    const currentStore = useAuthStore((s) => s.currentStore);

    if (!currentStore) {
        return (
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div>
                    <div className="h-4 w-24 rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    const { image, name, phone, location } = currentStore;
    const initial = name ? name.charAt(0).toUpperCase() : "?";

    return (
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-300 text-lg font-semibold text-white">
                        {initial}
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <div className="truncate text-base font-semibold text-gray-800">
                    {name}
                </div>
                <div className="mt-0.5 text-xs text-gray-500">
                    {location ? `${location} · ` : ""}
                    {phone ?? "—"}
                </div>
            </div>
        </div>
    );
}
