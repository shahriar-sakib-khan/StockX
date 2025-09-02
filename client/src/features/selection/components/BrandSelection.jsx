import { useNavigate } from "react-router-dom";
import SelectionCard from "./SelectionCard";
import { useEffect, useState } from "react";
import {
    useDivisionBrands,
    useSaveSelectedDivisionBrands,
} from "../../../hooks/useBrand";
import brandLogo from "../../../assets/images/bashundhara.webp";
import { divisionId, workspaceId } from "../../../utils/IDS";

export default function BrandSelection() {
    const navigate = useNavigate();

    // Fetch brands
    const { data: allBrands = [], isLoading: loadingAll } = useDivisionBrands(
        workspaceId,
        divisionId,
    );

    const { mutate: saveBrands, isLoading: isSaving } =
        useSaveSelectedDivisionBrands(workspaceId, divisionId);

    // Local draft: [{id, isActive}]
    const [draftBrands, setDraftBrands] = useState([]);

    // Initialize selection (mirror from API but only id + isActive)
    useEffect(() => {
        if (Array.isArray(allBrands) && allBrands.length > 0) {
            setDraftBrands(
                allBrands.map((b) => ({ id: b.id, isActive: b.isActive })),
            );
        }
    }, [allBrands]);

    // Toggle one brand
    const toggleSingleBrand = (id) =>
        setDraftBrands((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, isActive: !b.isActive } : b,
            ),
        );

    // Select/Deselect all
    const toggleAllBrandsSelection = () => {
        const allActive = draftBrands.every((b) => b.isActive);
        setDraftBrands((prev) =>
            prev.map((b) => ({ ...b, isActive: !allActive })),
        );
    };

    // Submit
    const submitSelectedBrands = () => {
        if (!draftBrands.length) return;
        saveBrands(draftBrands, {
            onSuccess: () => navigate("./initialization"),
        });
    };

    const allSelected =
        draftBrands.length > 0 && draftBrands.every((b) => b.isActive);
    const selectedCount = draftBrands.filter((b) => b.isActive).length;
    const isSubmitDisabled = draftBrands.length === 0 || isSaving || loadingAll;

    return (
        <main className="bg-gray-50 p-6">
            <div className="mx-auto max-w-5xl">
                {/* Header + Submit */}
                <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <h2 className="text-2xl font-semibold text-gray-500">
                            Select brands
                        </h2>
                        <button
                            className={`rounded-md px-4 py-2 font-semibold text-white ${
                                isSubmitDisabled
                                    ? "cursor-not-allowed bg-gray-300"
                                    : "primary-button"
                            }`}
                            onClick={submitSelectedBrands}
                            disabled={isSubmitDisabled}
                        >
                            {isSaving ? "Saving..." : "Submit"}
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
                            onClick={toggleAllBrandsSelection}
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
                                      name={brandInfo?.globalBrand} // wtf
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
