import { useState } from "react";
import { Tabs, Modal } from "@/components";
import { CylinderTable, StoveTable, RegulatorTable } from "@/features";
import BrandSelection from "./BrandSelectionPage";

export default function InventoryPage() {
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleBrandSelectionDone = () => {
        setIsBrandModalOpen(false);
        setRefreshKey((prev) => prev + 1);
    };

    const tabs = [
        { key: "cylinders", label: "Cylinders" },
        { key: "stoves", label: "Stoves" },
        { key: "regulators", label: "Regulators" },
    ];

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-2 bg-gray-100 p-2">
            {/* Top bar with action */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-700">
                    Inventory
                </h1>

                <button
                    onClick={() => setIsBrandModalOpen(true)}
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-all hover:bg-emerald-700 active:bg-emerald-800"
                >
                    Select Brand
                </button>
            </div>

            <Tabs tabs={tabs} defaultActive={tabs[0].key}>
                {({ activeTab }) => (
                    <>
                        {activeTab === "cylinders" && (
                            <CylinderTable
                                type="cylinders"
                                key={`c-${refreshKey}`} // force re-render
                            />
                        )}
                        {activeTab === "stoves" && <StoveTable type="stoves" />}
                        {activeTab === "regulators" && (
                            <RegulatorTable type="regulators" />
                        )}
                    </>
                )}
            </Tabs>

            <Modal
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                title="Select Brands"
                size="lg"
            >
                <BrandSelection onDone={handleBrandSelectionDone} />
            </Modal>
        </div>
    );
}
