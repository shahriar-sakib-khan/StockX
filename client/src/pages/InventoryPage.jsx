import { Tabs } from "@/components";
import { CylinderTable, StoveTable, RegulatorTable } from "@/features";

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
                            <CylinderTable type="cylinders" />
                        )}
                        {activeTab === "stoves" && <StoveTable type="stoves" />}
                        {activeTab === "regulators" && (
                            <RegulatorTable type="regulators" />
                        )}
                    </>
                )}
            </Tabs>
        </div>
    );
}
