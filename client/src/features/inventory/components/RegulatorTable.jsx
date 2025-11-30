import { useAuthStore } from "@/stores/useAuthStore";
import { TableRow } from "../utils";
import { useRegulatorInventory } from "../hooks";
import InventoryTable from "./InventoryTable";
import InventoryMobileCard from "./InventoryMobileCard"; // Shared card

export default function RegulatorTable({ type }) {
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const { data: regulators = [], isLoading, error } = useRegulatorInventory(storeId);

    const headers = ["#", "Regulator Type", "Status", "Price", "In Stock", "Defected", "Action"];

    if (error) return <div className="p-8 text-center text-red-500">Failed to load {type}.</div>;

    return (
        <div className="flex flex-col gap-4">

            {/* --- LOADING STATE --- */}
            {isLoading && (
                <div className="py-10 text-center text-gray-500">Loading regulators...</div>
            )}

            {/* --- EMPTY STATE --- */}
            {!isLoading && regulators.length === 0 && (
                <div className="py-10 text-center text-gray-500">No regulators found.</div>
            )}

            {/* --- VIEW 1: MOBILE CARD LIST --- */}
            {!isLoading && regulators.length > 0 && (
                <div className="flex flex-col gap-3 md:hidden">
                    {regulators.map((item, index) => (
                        <InventoryMobileCard
                            key={item.id || index}
                            product={{
                                ...item,
                                name: `${item.regulatorType}mm Regulator` // Helper name for card
                            }}
                            type={type}
                        />
                    ))}
                </div>
            )}

            {/* --- VIEW 2: DESKTOP TABLE --- */}
            {!isLoading && regulators.length > 0 && (
                <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-[800px] w-full align-middle">
                            <InventoryTable headers={headers}>
                                {regulators.map((item, index) => (
                                    <TableRow
                                        key={item.id || index}
                                        index={index}
                                        product={item}
                                        type={type}
                                    />
                                ))}
                            </InventoryTable>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
