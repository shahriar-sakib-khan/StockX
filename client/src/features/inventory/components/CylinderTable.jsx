import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCylinderInventory } from "../hooks/useCylinderInventory";
import InventoryTable from "./InventoryTable";
import { TableRow } from "../utils/TableRow";
import SearchBar from "../utils/SearchBar";
import CylinderFilters from "../utils/CylinderFilter";
import SortBy from "../utils/SortDropdown";

export default function CylinderTable({ overview = false, itemCount, type }) {
    // ----------------- States -----------------
    const [search, setSearch] = useState("");
    const [selectedSize, setSelectedSize] = useState("12");
    const [selectedType, setSelectedType] = useState("22");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // ----------------- Constants -----------------
    const headers = [
        "#",
        "Brand",
        "Status",
        "Full",
        "Empty",
        "Problem",
        "Action",
    ];
    const sizes = ["5", "12", "20", "45"];
    const types = ["20", "22"];
    const storeId = useAuthStore((s) => s.currentStore?.id);

    // ----------------- Queries -----------------
    const {
        data: cylinders = [],
        isLoading,
        error,
    } = useCylinderInventory(storeId, selectedSize, selectedType);

    // ----------------- Filter + Sort Logic -----------------
    let displayedCylinders =
        typeof itemCount === "number"
            ? cylinders.slice(0, itemCount)
            : [...cylinders];

    // Search
    if (search.trim() !== "" && displayedCylinders.length > 0) {
        displayedCylinders = displayedCylinders.filter((item) =>
            String(item.brandName || "")
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }

    // Sort by name, full count, empty count, or problem count
    displayedCylinders.sort((a, b) => {
        let valueA, valueB;

        switch (sortBy) {
            case "full":
                valueA = a.fullCount || 0;
                valueB = b.fullCount || 0;
                break;
            case "empty":
                valueA = a.emptyCount || 0;
                valueB = b.emptyCount || 0;
                break;
            case "problem":
                valueA = a.problemCount || 0;
                valueB = b.problemCount || 0;
                break;
            case "name":
            default:
                valueA = String(a.brandName || "").toLowerCase();
                valueB = String(b.brandName || "").toLowerCase();
                break;
        }

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // ----------------- Conditional UI -----------------
    if (isLoading) return <p>Loading {type}s...</p>;
    if (error) return <p className="text-red-500">Failed to load {type}s.</p>;

    // ----------------- Render -----------------
    return (
        <div className="w-full bg-transparent p-4">
            {/* ----------------- Top Controls ----------------- */}
            {/* Search */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {!overview && (
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder={`Search ${type}...`}
                            className="w-[200px]"
                        />
                    )}

                    {/* Size & Type Filters */}
                    {type === "cylinders" && (
                        <CylinderFilters
                            sizes={sizes}
                            types={types}
                            selectedSize={selectedSize}
                            selectedType={selectedType}
                            onSizeChange={setSelectedSize}
                            onTypeChange={setSelectedType}
                        />
                    )}
                </div>

                {/* Sort By */}
                <SortBy
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
            </div>

            {/* ----------------- Table ----------------- */}
            <InventoryTable headers={headers}>
                {displayedCylinders.map((item, index) => (
                    <TableRow
                        key={item.id || index}
                        index={index}
                        product={item}
                        type={type}
                        selectedSize={selectedSize}
                        selectedType={selectedType}
                        onEdit={() => {}}
                        onDelete={() => {}}
                    />
                ))}
            </InventoryTable>
        </div>
    );
}
