import { BrandSelection, InventoryTable } from "../features";
import SelectionCard from "../features/selection/components/SelectionCard";
import TestBrands from "../features/inventory/components/TestBrands";

export default function InventoryPage() {
  const workspaceId = "68a481f250fec8909ab2670c";
  const divisionId = "68a481f850fec8909ab26719";

  return (
    <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-2 bg-gray-100 p-2">
      <div className="">
        <InventoryTable />
      </div>
      <BrandSelection workspaceId={workspaceId} divisionId={divisionId} />
      {/* <TestBrands /> */}
    </div>
  );
}
