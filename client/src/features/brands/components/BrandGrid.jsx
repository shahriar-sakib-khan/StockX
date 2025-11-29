import BrandCard from "./BrandCard";

export default function BrandGrid({ brands, selectedBrands, onToggle }) {
    if (brands.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                No brands found.
            </div>
        );
    }

    return (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {brands.map((brand) => {
                const isActive = selectedBrands[brand.id];
                const original = brand.isActive;
                // If the current selection differs from the original DB state, it's "changed"
                const changed = original !== isActive;

                return (
                    <BrandCard
                        key={brand.id}
                        brand={brand}
                        isActive={isActive}
                        changed={changed}
                        onToggle={onToggle}
                    />
                );
            })}
        </section>
    );
}
