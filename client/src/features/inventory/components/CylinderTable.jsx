import { useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";

import InventoryTable from "./InventoryTable";
import { useCylinderInventory } from "../hooks";
import { TableRow, SearchBar, CylinderFilters, SortBy } from "../utils";

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
        "Price",
        "Full",
        "Empty",
        "Defected",
        "Action",
    ];
    // const sizes = ["5", "12", "20"];
    const sizes = [
        "5.5",
        "12",
        "12.5",
        "15",
        "20",
        "25",
        "30",
        "33",
        "35",
        "45",
    ];
    const types = ["20", "22"];
    const storeId = useAuthStore((s) => s.currentStore?.id);

    // ----------------- Queries -----------------
    const {
        data: cylinders = [],
        isLoading,
        error,
    } = useCylinderInventory(storeId, selectedSize, selectedType);

    // ----------------- Filter + Sort -----------------
    let displayedCylinders =
        typeof itemCount === "number"
            ? cylinders.slice(0, itemCount)
            : [...cylinders];

    // ----------------- Search -----------------
    if (search.trim() !== "" && displayedCylinders.length > 0) {
        displayedCylinders = displayedCylinders.filter((item) =>
            String(item.brandName || "")
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }

    // Sort by name, full count, empty count, or defected cylinder count
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
            case "defected":
                valueA = a.defectedCount || 0;
                valueB = b.defectedCount || 0;
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
    if (error)
        return (
            <p className="mt-4 text-center text-red-500">
                Failed to load {type}s.
            </p>
        );

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

            {/* ----------------- Loading Indicator ----------------- */}
            {isLoading && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 italic">
                    <svg
                        className="h-5 w-5 animate-spin text-emerald-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.36 6.36l-1.42-1.42M6.36 6.36 4.94 4.94m12.02 0-1.42 1.42M6.36 17.64l-1.42 1.42"
                        />
                    </svg>
                    Loading {type} data...
                </div>
            )}
        </div>
    );
}
