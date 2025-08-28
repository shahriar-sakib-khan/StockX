import { InventoryTable } from "../features";

export default function InventoryPage() {
  return (
    <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-wrap gap-2 bg-gray-100 p-2">
      <InventoryTable />
    </div>
  );
}
