import { useNavigate } from "react-router-dom";
import SelectionCard from "./SelectionCard";
import { useEffect, useState } from "react";
import {
  useGlobalBrands,
  useDivisionBrands,
  useSaveDivisionBrands,
} from "../../../hooks/useBrand";
import brandLogo from "../../../assets/images/bashundhara.webp";

export default function BrandSelection() {
  const navigate = useNavigate();

  const workspaceId = "68a481f250fec8909ab2670c";
  const divisionId = "68a481f850fec8909ab26719";

  // Fetch brands
  const { data: allBrands = [], isLoading: loadingAll } = useGlobalBrands(
    workspaceId,
    divisionId,
  );
  const { data: selectedBrands = [], isLoading: loadingSelected } =
    useDivisionBrands(workspaceId, divisionId);

  const { mutate: saveBrands, isLoading: isSaving } = useSaveDivisionBrands(
    workspaceId,
    divisionId,
  );

  // Store only selected IDs
  const [draftSelectedIds, setDraftSelectedIds] = useState([]);

  // Initialize selection
  useEffect(() => {
    if (Array.isArray(selectedBrands) && selectedBrands.length > 0) {
      setDraftSelectedIds(selectedBrands.map((b) => b.id));
    }
  }, [selectedBrands]);

  const toggleSingleBrand = (id) =>
    setDraftSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleAllBrandsSelection = () =>
    setDraftSelectedIds(
      draftSelectedIds.length === allBrands.length
        ? []
        : allBrands.map((b) => b.id),
    );

  const submitSelectedBrands = () => {
    if (!draftSelectedIds.length) return;
    saveBrands(draftSelectedIds, {
      onSuccess: () => navigate("./initialization"),
    });
  };

  const allSelected = draftSelectedIds.length === allBrands.length;
  const isSubmitDisabled =
    draftSelectedIds.length === 0 || isSaving || loadingAll || loadingSelected;

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
              Selected: {draftSelectedIds.length} / {allBrands.length}
            </span>
          </div>
        </section>

        {/* Brand list */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {loadingAll || loadingSelected
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded bg-gray-200/50"
                />
              ))
            : allBrands.map((brand) => (
                <SelectionCard
                  key={brand.id}
                  id={brand.id}
                  name={brand.name}
                  logo={brandLogo}
                  isSelected={draftSelectedIds.includes(brand.id)}
                  onSelect={() => toggleSingleBrand(brand.id)}
                />
              ))}
        </section>
      </div>
    </main>
  );
}
