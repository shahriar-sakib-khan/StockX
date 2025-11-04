import { useAuthStore } from "@/stores/useAuthStore";
import { TableRow, SearchBar } from "../utils";
import { useStoveInventory } from "../hooks";
import InventoryTable from "./InventoryTable";

export default function StoveTable({ type }) {
    // ----------------- Constants -----------------
    const headers = [
        "#",
        "Burner Count",
        "Status",
        "Price",
        "In Stock",
        "Defected",
        "Action",
    ];

    const storeId = useAuthStore((s) => s.currentStore?.id);

    // ----------------- Queries -----------------
    const { data: stoves = [], isLoading, error } = useStoveInventory(storeId);

    // ----------------- Conditional UI -----------------
    if (isLoading) return <p>`Loading ${type}s...`</p>;
    if (error)
        return <p className="text-red-500">`Failed to load ${type}s.`</p>;

    // ----------------- Render -----------------
    return (
        <div className="w-full bg-transparent p-4">
            {/* Inventory Table for Stoves */}
            <InventoryTable headers={headers}>
                {stoves.map((item, index) => (
                    <TableRow
                        key={item.id}
                        index={index + 1}
                        product={item}
                        type={type}
                        onEdit={() => {}}
                        onDelete={() => {}}
                    />
                ))}
            </InventoryTable>
        </div>
    );
}
