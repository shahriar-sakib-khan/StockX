import { useState } from "react";
import CylinderCard from "./CylinderCard";
import CylinderInfoCard from "./CylinderInfoCard";

export default function BrandBox({ brand }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex h-73 items-start gap-4 overflow-hidden rounded-2xl border border-gray-300 bg-gray-200 p-2 transition-all duration-300 ${
        open ? "w-[525px]" : "w-[225px]"
      }`}
    >
      {/* Cylinder card */}
      <div className="flex-shrink-0">
        <CylinderCard
          brand={brand}
          onToggle={() => setOpen(!open)}
          isOpen={open}
        />
      </div>

      {/* Stock info */}
      <div
        className={`flex-1 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-10"}`}
      >
        <CylinderInfoCard stock={brand.cylinders} isOpen={open} />
      </div>
    </div>
  );
}
