import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCylinderInventory } from "../hooks";
import { TableRow, SearchBar, CylinderFilters, SortBy } from "../utils";
import InventoryTable from "./InventoryTable";
import InventoryMobileCard from "./InventoryMobileCard"; // <--- Import the new card

export default function CylinderTable({ overview = false, itemCount, type }) {
    // ... [Keep all your existing State and Sorting logic exactly the same] ...
    const [search, setSearch] = useState("");
    const [selectedSize, setSelectedSize] = useState("12");
    const [selectedRegulatorType, setSelectedRegulatorType] = useState("22");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const storeId = useAuthStore((s) => s.currentStore?.id);

    const {
        data: cylinders = [],
        isLoading,
        error,
    } = useCylinderInventory(storeId, selectedSize, selectedRegulatorType);

    // ... [Keep processing logic] ...
    let processedData = [...cylinders];
    if (search.trim()) {
        processedData = processedData.filter((item) =>
            String(item.brandName || item.name || "")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }
    processedData.sort((a, b) => {
        // ... [Keep existing sort logic] ...
        let valA, valB;
        switch (sortBy) {
            case "full": valA = a.fullCount || 0; valB = b.fullCount || 0; break;
            case "empty": valA = a.emptyCount || 0; valB = b.emptyCount || 0; break;
            case "defected": valA = a.defectedCount || 0; valB = b.defectedCount || 0; break;
            default: // name
                valA = String(a.brandName || "").toLowerCase();
                valB = String(b.brandName || "").toLowerCase();
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    if (itemCount) processedData = processedData.slice(0, itemCount);

    const headers = ["#", "Brand", "Status", "Price", "Full", "Empty", "Defected", "Action"];
    const sizes = ["5.5", "12", "12.5", "15", "20", "25", "30", "33", "35", "45"];
    const types = ["20", "22"];

    if (error) return <div className="p-8 text-center text-red-500">Failed to load inventory.</div>;

    return (
        <div className="flex flex-col gap-4">
            {/* Controls (Keep as is, they are already responsive) */}
            {!overview && (
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-1 flex-col gap-4 xl:flex-row xl:items-center">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Search brands..."
                            className="w-full xl:w-72"
                        />
                        <CylinderFilters
                            sizes={sizes}
                            types={types}
                            selectedSize={selectedSize}
                            selectedRegulatorType={selectedRegulatorType}
                            onSizeChange={setSelectedSize}
                            onTypeChange={setSelectedRegulatorType}
                        />
                    </div>
                    <div className="flex justify-end">
                        <SortBy
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                        />
                    </div>
                </div>
            )}

            {/* --- LOADING STATE --- */}
            {isLoading && (
                <div className="py-10 text-center text-gray-500">Loading inventory...</div>
            )}

            {/* --- EMPTY STATE --- */}
            {!isLoading && processedData.length === 0 && (
                <div className="py-10 text-center text-gray-500">No items found.</div>
            )}

            {/* --- VIEW 1: MOBILE CARD LIST (Visible on small screens) --- */}
            {!isLoading && processedData.length > 0 && (
                <div className="flex flex-col gap-3 md:hidden">
                    {processedData.map((item, index) => (
                        <InventoryMobileCard
                            key={item.id || index}
                            product={item}
                            type={type}
                            selectedSize={selectedSize}
                            selectedRegulatorType={selectedRegulatorType}
                        />
                    ))}
                </div>
            )}

            {/* --- VIEW 2: DESKTOP TABLE (Hidden on small screens) --- */}
            {!isLoading && processedData.length > 0 && (
                <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
                    <div className="overflow-x-auto">
                        <InventoryTable headers={headers}>
                            {processedData.map((item, index) => (
                                <TableRow
                                    key={item.id || index}
                                    index={index}
                                    product={item}
                                    type={type}
                                    selectedSize={selectedSize}
                                    selectedRegulatorType={selectedRegulatorType}
                                />
                            ))}
                        </InventoryTable>
                    </div>
                </div>
            )}
        </div>
    );
}
