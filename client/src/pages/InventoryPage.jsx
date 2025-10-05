import { useState } from "react";
import { Tabs } from "../components";
import { BrandSelection, InventoryTable } from "../features";
// import TestBrands from "../features/inventory/components/TestBrands";

export default function InventoryPage() {
    const [showBrandSelection, setShowBrandSelection] = useState(false);

    const tabs = [
        { key: "cylinders", label: "Cylinders" },
        { key: "stoves", label: "Stoves" },
        { key: "regulators", label: "Regulators" },
    ];

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-2 bg-gray-100 p-2">
            <Tabs tabs={tabs} defaultActive={tabs[0].key}>
                {({ activeTab }) => (
                    <>
                        {activeTab === "cylinders" && (
                            <InventoryTable type="cylinders" />
                        )}
                        {activeTab === "stoves" && (
                            <InventoryTable type="stoves" />
                        )}
                        {activeTab === "regulators" && (
                            <InventoryTable type="regulators" />
                        )}
                    </>
                )}
            </Tabs>

            {!showBrandSelection ? (
                <button
                    className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    onClick={() => setShowBrandSelection(true)}
                >
                    Select Brands
                </button>
            ) : (
                <BrandSelection />
            )}

            {/* <TestBrands /> */}
        </div>
    );
}
