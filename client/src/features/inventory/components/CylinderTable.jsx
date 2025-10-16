import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCylinderInventory } from "../hooks/useCylinderInventory";
import InventoryTable from "./InventoryTable";
import { TableRow } from "../utils/TableRow";
import SearchBar from "../utils/SearchBar";
import CylinderFilters from "../utils/CylinderFilter";
import SortBy from "./../utils/SortDropdown";

export default function CylinderTable({ overview = false, itemCount, type }) {
    // ----------------- States -----------------
    const [search, setSearch] = useState("");
    const [selectedSize, setSelectedSize] = useState("12");
    const [selectedType, setSelectedType] = useState("22");
    const [sortBy, setSortBy] = useState("name"); // ✅ default: name
    const [sortOrder, setSortOrder] = useState("asc"); // ✅ default: ascending

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
    if (search.trim() !== "") {
        displayedCylinders = displayedCylinders.filter((item) =>
            String(item.brandName || "")
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }

    // Sorting
    const sortMultiplier = sortOrder === "asc" ? 1 : -1;
    displayedCylinders.sort((a, b) => {
        switch (sortBy) {
            case "full":
                return (a.full - b.full) * sortMultiplier;
            case "empty":
                return (a.empty - b.empty) * sortMultiplier;
            case "problem":
                return (a.problem - b.problem) * sortMultiplier;
            case "name":
            default:
                return (
                    (a.brandName || "").localeCompare(b.brandName || "") *
                    sortMultiplier
                );
        }
    });

    // ----------------- Conditional UI -----------------
    if (isLoading) return <p>Loading {type}s...</p>;
    if (error) return <p className="text-red-500">Failed to load {type}s.</p>;

    // ----------------- Render -----------------
    return (
        <div className="w-full bg-transparent p-4">
            {/* Controls */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {!overview && (
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder={`Search ${type}...`}
                        className="min-w-[200px] flex-1"
                    />
                )}

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

                {/* ✅ Sorting Component */}
                <SortBy
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onChange={setSortBy}
                    onToggleOrder={() =>
                        setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc",
                        )
                    }
                />
            </div>

            {/* Inventory Table */}
            <InventoryTable headers={headers}>
                {displayedCylinders.map((item, index) => (
                    <TableRow
                        key={item.id || index}
                        index={index + 1}
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
