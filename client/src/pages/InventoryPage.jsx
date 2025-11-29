import { useState } from "react";
import { FaPlus } from "react-icons/fa";

// Components
import { Tabs, Modal } from "@/components";
import BrandSelection from "./BrandSelectionPage";
import { CylinderTable, StoveTable, RegulatorTable } from "@/features";

export default function InventoryPage() {
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

    const handleBrandSelectionDone = () => {
        setIsBrandModalOpen(false);
        // Optionally trigger a refetch here if needed
    };

    const tabs = [
        { key: "cylinders", label: "Cylinders" },
        { key: "stoves", label: "Stoves" },
        { key: "regulators", label: "Regulators" },
    ];

    return (
        <div className="flex h-full flex-col gap-4 bg-gray-50 p-4 md:p-6">
            {/* Top Action Bar */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <p className="text-sm text-gray-500">Manage stock, prices, and defected items.</p>
                </div>

                <button
                    onClick={() => setIsBrandModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 sm:w-auto"
                >
                    <FaPlus /> Manage Brands
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <Tabs tabs={tabs} defaultActive={tabs[0].key}>
                    {({ activeTab }) => (
                        <div className="h-full overflow-y-auto p-4">
                            {activeTab === "cylinders" && <CylinderTable type="cylinders" />}
                            {activeTab === "stoves" && <StoveTable type="stoves" />}
                            {activeTab === "regulators" && <RegulatorTable type="regulators" />}
                        </div>
                    )}
                </Tabs>
            </div>

            {/* Brand Selection Modal */}
            <Modal
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                title="Manage Store Brands"
                size="lg"
            >
                <BrandSelection onDone={handleBrandSelectionDone} mode="modal" />
            </Modal>
        </div>
    );
}
