import { useNavigate } from "react-router-dom";
import SelectionCard from "./SelectionCard";
import { useEffect, useState } from "react";

export default function BrandSelection() {
  const navigate = useNavigate();

  // Placeholder state until stores are ready
  const [draftSelectedBrands] = useState([]);
  const [allBrands] = useState([
    { id: 1, name: "Brand A", logo: "/logos/brandA.png" },
    { id: 2, name: "Brand B", logo: "/logos/brandB.png" },
    { id: 3, name: "Brand C", logo: "/logos/brandC.png" },
  ]);

  // Placeholder functions for selection logic
  const toggleSingleBrand = (id) => {
    id;
    // To be implemented later
  };

  const toggleAllBrandsSelection = () => {
    // To be implemented later
  };

  const submitSelectedBrands = () => {
    // To be implemented later
  };

  const initializeDraft = () => {
    // To be implemented later
  };

  useEffect(() => {
    initializeDraft();
  }, []);

  const handleSubmit = () => {
    if (draftSelectedBrands.length > 0) {
      submitSelectedBrands();
      navigate("./initialization");
    }
  };

  const allSelected = draftSelectedBrands.length === allBrands.length;
  const isSubmitDisabled = draftSelectedBrands.length === 0;

  return (
    <main className="bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Title and submit */}
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Selection Page
            </h2>
            <button
              className={`rounded-md px-4 py-2 font-medium text-white ${
                isSubmitDisabled
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Submit
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
              Selected: {draftSelectedBrands.length} / {allBrands.length}
            </span>
          </div>
        </section>

        {/* Brand list */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {allBrands.map((brand) => (
            <SelectionCard
              key={brand.id}
              id={brand.id}
              name={brand.name}
              logo={brand.logo}
              isSelected={draftSelectedBrands.some((b) => b.id === brand.id)}
              onSelect={() => toggleSingleBrand(brand.id)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
