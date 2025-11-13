import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/useAuthStore";
import { useBrands, useUpdateBrands } from "@/features/brands/hooks/useBrand";

import { BrandHeader, BrandGrid } from "@/features";

export default function BrandSelectionPage({ onDone, mode }) {    
    const navigate = useNavigate();
    const storeId = useAuthStore((state) => state.currentStore)?.id;

    const { data: brands = [], isLoading, isError } = useBrands(storeId, mode);
    const updateBrands = useUpdateBrands(
        storeId,
        onDone || (() => navigate("/dashboard")),
    );

    const [selectedBrands, setSelectedBrands] = useState({});
    const [changedBrands, setChangedBrands] = useState([]);

    useEffect(() => {
        if (brands.length > 0) {
            const map = {};
            brands.forEach((b) => (map[b.id] = b.isActive));
            setSelectedBrands(map);
        }
    }, [brands]);

    const toggleBrand = (id) => {
        setSelectedBrands((prev) => {
            const newState = !prev[id];
            const updated = { ...prev, [id]: newState };

            setChangedBrands((prevChanges) => {
                const existing = prevChanges.find((b) => b.id === id);
                const original = brands.find((b) => b.id === id)?.isActive;

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
            toast.info("No changes to submit.");
            return;
        }
        updateBrands.mutate(changedBrands);
    };

    const allSelected = Object.values(selectedBrands).every(Boolean);
    const selectedCount = Object.values(selectedBrands).filter(Boolean).length;

    if (!storeId)
        return <div className="p-4 text-red-500">No store selected.</div>;
    if (isLoading)
        return (
            <div className="flex h-64 items-center justify-center text-gray-500">
                Loading brands...
            </div>
        );
    if (isError)
        return <div className="p-4 text-red-500">Failed to load brands.</div>;

    return (
        <main
            className={`bg-gray-50 p-4 ${
                onDone ? "max-h-[70vh] overflow-y-auto" : "min-h-screen p-6"
            }`}
        >
            <div
                className={`mx-auto ${onDone ? "max-w-3xl" : "max-w-7xl"} space-y-8`}
            >
                <BrandHeader
                    allSelected={allSelected}
                    selectedCount={selectedCount}
                    totalCount={brands.length}
                    changedCount={changedBrands.length}
                    toggleAll={toggleAll}
                    handleSubmit={handleSubmit}
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
