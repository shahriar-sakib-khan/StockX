import { useAuthStore } from "@/stores/useAuthStore";
import { TableRow, SearchBar } from "../utils";
import { useRegulatorInventory } from "../hooks";
import InventoryTable from "./InventoryTable";

export default function CylinderTable({ type }) {
    // ----------------- Constants -----------------
    const headers = [
        "#",
        "Regulator Type",
        "Status",
        "Price",
        "In Stock",
        "Problem",
        "Action",
    ];

    const storeId = useAuthStore((s) => s.currentStore?.id);

    // ----------------- Queries -----------------
    const {
        data: regulators = [],
        isLoading,
        error,
    } = useRegulatorInventory(storeId);

    // ----------------- Conditional UI -----------------
    if (isLoading) return <p>`Loading ${type}s...`</p>;
    if (error)
        return <p className="text-red-500">`Failed to load ${type}s.`</p>;

    // ----------------- Render -----------------
    return (
        <div className="w-full bg-transparent p-4">
            {/* Inventory Table for Regulators */}
            <InventoryTable headers={headers}>
                {regulators.map((item, index) => (
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
