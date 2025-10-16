import { useNavigate } from "react-router-dom";
import SelectionCard from "../features/selection/components/SelectionCard";
import { useEffect, useState } from "react";
import {
    useBrands,
    useSaveSelectedBrands,
} from "../features/brands/hooks/brandHooks";
import brandLogo from "@/assets/images/bashundhara.webp";
import { useAuthStore } from "@/stores/useAuthStore";
import { logOnce } from "@/pages/utils/logOnce";

export default function BrandSelection({ onDone }) {
    const navigate = useNavigate();

    // Fetch brands
    const storeId = useAuthStore((state) => state.currentStore)?.id;
    const { data: allBrands = [], isLoading: loadingAll } = useBrands(storeId);
    logOnce(allBrands);

    const { mutate: saveBrands, isLoading: isSaving } =
        useSaveSelectedBrands(storeId);

    const [draftBrands, setDraftBrands] = useState([]);

    useEffect(() => {
        if (Array.isArray(allBrands) && allBrands.length > 0) {
            const sortedBrands = [...allBrands]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((b) => ({ id: b.id, isActive: b.isActive }));
            setDraftBrands(sortedBrands);
        }
    }, [allBrands]);

    // Toggle one brand
    const toggleSingleBrand = (id) => {
        setDraftBrands((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, isActive: !b.isActive } : b,
            ),
        );
    };

    // Select/Deselect all
    const toggleAllBrandsSelection = () => {
        const allActive = draftBrands.every((b) => b.isActive);
        setDraftBrands((prev) =>
            prev.map((b) => ({ ...b, isActive: !allActive })),
        );
    };

    // Submit
    const submitSelectedBrands = () => {
        if (!Array.isArray(draftBrands) || draftBrands.length === 0) return;
        if (!storeId) {
            console.error("No store selected — cannot save brands");
            return;
        }

        saveBrands(draftBrands, {
            onSuccess: () => {
                // If opened inside modal -> close modal instead of redirecting
                if (onDone) onDone();
                else navigate("/dashboard"); // default for onboarding flow
            },
            onError: (err) => console.error("Failed to update brands:", err),
        });
    };

    const allSelected =
        draftBrands.length > 0 && draftBrands.every((b) => b.isActive);
    const selectedCount = draftBrands.filter((b) => b.isActive).length;
    const isSubmitDisabled = draftBrands.length === 0 || isSaving || loadingAll;

    return (
        <main className="bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl">
                {/* Header + Actions */}
                <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            Select Brands
                        </h2>

                        {/* Submit */}
                        <button
                            onClick={submitSelectedBrands}
                            disabled={isSubmitDisabled}
                            className={`rounded-lg px-5 py-2.5 text-sm font-medium shadow transition-all ${
                                isSubmitDisabled
                                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                    : "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
                            }`}
                        >
                            {isSaving ? "Saving..." : "Submit"}
                        </button>
                    </div>

                    {/* Select All / Deselect */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleAllBrandsSelection}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                            {allSelected ? "Deselect All" : "Select All"}
                        </button>

                        <span className="font-medium text-gray-700">
                            Selected: {selectedCount} / {draftBrands.length}
                        </span>
                    </div>
                </section>

                {/* Brand list */}
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {loadingAll
                        ? [...Array(3)].map((_, i) => (
                              <div
                                  key={i}
                                  className="h-20 animate-pulse rounded bg-gray-200/50"
                              />
                          ))
                        : draftBrands.map((brand) => {
                              const brandInfo = allBrands.find(
                                  (b) => b.id === brand.id,
                              );
                              return (
                                  <SelectionCard
                                      key={brand.id}
                                      id={brand.id}
                                      name={brandInfo?.name}
                                      logo={brandLogo}
                                      isSelected={brand.isActive}
                                      onSelect={() =>
                                          toggleSingleBrand(brand.id)
                                      }
                                  />
                              );
                          })}
                </section>
            </div>
        </main>
    );
}
