import { BrandSelection, InventoryTable } from "../features";
import SelectionCard from "../features/selection/components/SelectionCard";

export default function InventoryPage() {
  return (
    <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col flex-wrap gap-2 bg-gray-100 p-2">
      <div className="">
        <InventoryTable />
      </div>
      {/* <BrandSelection /> */}
      {/* <SelectionCard
        key="hello"
        id="hello"
        name="hello"
        // logo={}
        isSelected={false}
        onSelect={() => {}}
      /> */}
    </div>
  );
}
