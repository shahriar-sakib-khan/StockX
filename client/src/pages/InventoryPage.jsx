import { Tabs } from "../components";
import { BrandSelection, InventoryTable } from "../features";
import TestBrands from "../features/inventory/components/TestBrands";

export default function InventoryPage() {
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
                            <InventoryTable type="cylinder" />
                        )}
                        {activeTab === "stoves" && (
                            <InventoryTable type="stove" />
                        )}
                        {activeTab === "regulators" && (
                            <InventoryTable type="regulator" />
                        )}
                    </>
                )}
            </Tabs>
            <BrandSelection />
            <TestBrands />
        </div>
    );
}
