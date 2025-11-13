import { useState } from "react";

import { Modal } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBrands } from "@/features/brands/hooks/useBrand";

import { TakeCylindersModal } from "./index";

export default function BrandSelectionModal({
    isOpen,
    onClose,
    onBrandSelect,
}) {
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const { data: brands = [], isLoading, isError } = useBrands(storeId);

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [takeModalOpen, setTakeModalOpen] = useState(false);

    const handleBrandClick = (brand) => {
        setSelectedBrand(brand);
        setTimeout(() => setTakeModalOpen(true), 120);
    };

    const handleDone = (payload) => {
        // payload from TakeCylindersModal: { brand, cylinder, quantity }
        // forward to parent -> ExchangeSection will add to store
        onBrandSelect(payload);
        setTakeModalOpen(false);
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Select Brand"
                size="lg"
            >
                {!storeId && (
                    <div className="p-4 text-red-500">No store selected.</div>
                )}

                {isLoading && (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                        Loading brands...
                    </div>
                )}

                {isError && (
                    <div className="p-4 text-red-500">
                        Failed to load brands.
                    </div>
                )}

                {!isLoading && brands.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {brands.map((brand) => (
                            <button
                                key={brand.id}
                                onClick={() => handleBrandClick(brand)}
                                className={`flex flex-col items-center rounded-lg border bg-white px-4 py-3 shadow-sm transition hover:shadow-md`}
                            >
                                <img
                                    src={
                                        brand.brandImage ||
                                        "/placeholder-brand.png"
                                    }
                                    alt={brand.name}
                                    className="mb-2 h-14 w-full object-contain"
                                />
                                <span className="text-center text-sm font-medium text-gray-700">
                                    {brand.name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {!isLoading && brands.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        No brands available.
                    </div>
                )}
            </Modal>

            <TakeCylindersModal
                isOpen={takeModalOpen}
                onClose={() => setTakeModalOpen(false)}
                brand={selectedBrand}
                onDone={handleDone}
            />
        </>
    );
}
