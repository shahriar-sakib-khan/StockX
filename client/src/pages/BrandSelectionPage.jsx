import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaExclamationTriangle } from "react-icons/fa"; // Added for error states

import { useAuthStore } from "@/stores/useAuthStore";
import { useBrands, useUpdateBrands } from "@/features/brands/hooks/useBrand";

// Internal Components
import { BrandHeader, BrandGrid } from "@/features";

export default function BrandSelectionPage({ onDone, mode }) {
    const navigate = useNavigate();
    const storeId = useAuthStore((state) => state.currentStore)?.id;

    const { data: brands = [], isLoading, isError } = useBrands(storeId, mode);

    // Default navigation if not used as a component
    const handleSuccess = onDone || (() => navigate("/dashboard"));

    const updateBrands = useUpdateBrands(storeId, handleSuccess);

    const [selectedBrands, setSelectedBrands] = useState({});
    const [changedBrands, setChangedBrands] = useState([]);

    // Initialize state when data loads
    useEffect(() => {
        if (brands.length > 0) {
            const map = {};
            brands.forEach((b) => (map[b.id] = b.isActive));
            setSelectedBrands(map);
        }
    }, [brands]);

    // Handle individual toggle
    const toggleBrand = (id) => {
        setSelectedBrands((prev) => {
            const newState = !prev[id];
            const updated = { ...prev, [id]: newState };

            setChangedBrands((prevChanges) => {
                const existing = prevChanges.find((b) => b.id === id);
                const original = brands.find((b) => b.id === id)?.isActive;

                // Logic to track only actual changes vs DB state
                if (existing) {
                    if (original === newState)
                        return prevChanges.filter((b) => b.id !== id);
                    return prevChanges.map((b) =>
                        b.id === id ? { ...b, isActive: newState } : b,
                    );
                } else {
                    if (original !== newState)
                        return [...prevChanges, { id, isActive: newState }];
                    return prevChanges;
                }
            });

            return updated;
        });
    };

    // Handle "Select All" / "Deselect All"
    const toggleAll = () => {
        const allSelected = Object.values(selectedBrands).every(Boolean);
        const toggled = {};
        const newChanges = [];

        Object.keys(selectedBrands).forEach((id) => {
            toggled[id] = !allSelected;
            const original = brands.find((b) => b.id === id)?.isActive;
            if (original !== !allSelected)
                newChanges.push({ id, isActive: !allSelected });
        });

        setSelectedBrands(toggled);
        setChangedBrands(newChanges);
    };

    const handleSubmit = async () => {
        if (changedBrands.length === 0) {
            // If just viewing/no changes, proceed without API call
            toast.info("No changes made.");
            handleSuccess();
            return;
        }
        updateBrands.mutate(changedBrands);
    };

    const allSelected = Object.values(selectedBrands).every(Boolean);
    const selectedCount = Object.values(selectedBrands).filter(Boolean).length;

    // --- State: No Store Selected ---
    if (!storeId) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-center p-4">
                <div className="mb-2 rounded-full bg-orange-100 p-3 text-orange-500">
                    <FaExclamationTriangle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No Store Selected</h3>
                <p className="text-gray-500">Please select a store to manage brands.</p>
                <button
                    onClick={() => navigate("/stores")}
                    className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                    Go to Stores
                </button>
            </div>
        );
    }

    // --- State: Loading ---
    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="text-sm font-medium text-gray-500">Loading brands...</p>
                </div>
            </div>
        );
    }

    // --- State: Error ---
    if (isError) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-center p-4">
                <div className="mb-2 rounded-full bg-red-100 p-3 text-red-500">
                    <FaExclamationTriangle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Failed to load brands</h3>
                <p className="text-gray-500">Something went wrong while fetching the brand list.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // --- State: Content ---
    return (
        <main
            className={`w-full bg-gray-50 ${
                onDone
                    ? "max-h-[70vh] overflow-y-auto p-4" // Modal Mode
                    : "min-h-screen px-4 py-8 md:p-12"   // Page Mode
            }`}
        >
            <div className={`mx-auto ${onDone ? "max-w-4xl" : "max-w-7xl"} space-y-6 md:space-y-8`}>
                <BrandHeader
                    allSelected={allSelected}
                    selectedCount={selectedCount}
                    totalCount={brands.length}
                    changedCount={changedBrands.length}
                    toggleAll={toggleAll}
                    handleSubmit={handleSubmit}
                    isLoading={updateBrands.isPending} // Pass loading state to header button
                />

                <BrandGrid
                    brands={brands}
                    selectedBrands={selectedBrands}
                    onToggle={toggleBrand}
                />
            </div>
        </main>
    );
}
