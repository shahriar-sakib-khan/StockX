import BrandCard from "./BrandCard";

export default function BrandGrid({ brands, selectedBrands, onToggle }) {
    return (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {brands.map((brand) => {
                const isActive = selectedBrands[brand.id];
                const original = brand.isActive;
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
