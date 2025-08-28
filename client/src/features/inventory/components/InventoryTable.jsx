import { useState } from "react";
import clsx from "clsx";
import cylinderImg from "../../../assets/images/cylinderModel.png";

const brands = [
  {
    id: "brand1",
    name: "Omera Gas",
    imageUrl: cylinderImg,
    stockCount: 10,
    cylinders: [
      { type: "20mm", size: 12, quantity: 50 },
      { type: "20mm", size: 33, quantity: 30 },
      { type: "22mm", size: 45, quantity: 10 },
    ],
  },
  {
    id: "brand2",
    name: "Bashundhara Gas",
    imageUrl: cylinderImg,
    stockCount: 20,
    cylinders: [
      { type: "20mm", size: 12, quantity: 40 },
      { type: "20mm", size: 33, quantity: 20 },
      { type: "22mm", size: 45, quantity: 5 },
    ],
  },
  {
    id: "brand3",
    name: "TotalGaz",
    imageUrl: cylinderImg,
    stockCount: 12,
    cylinders: [
      { type: "20mm", size: 12, quantity: 25 },
      { type: "20mm", size: 33, quantity: 15 },
      { type: "22mm", size: 45, quantity: 8 },
    ],
  },
];

const headers = ["#", "Brand", "Status", "Full", "Empty"];

// Header Component
function TableHeader() {
  return (
    <thead className="bg-gray-200/75 text-left text-sm font-semibold text-gray-600">
      <tr>
        {headers.map((h) => (
          <th key={h} className="p-4">
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// Row Component
function TableRow({ brand, index, selectedSize, selectedType }) {
  const cylinder = brand.cylinders.find(
    (c) => c.size === Number(selectedSize) && c.type === selectedType,
  );

  const quantity = cylinder ? cylinder.quantity : 0;

  let status = "out-of-stock";
  if (quantity > 20) status = "in-stock";
  else if (quantity > 0) status = "low-stock";

  const statusColors = {
    "in-stock": "bg-green-500 text-white",
    "low-stock": "bg-yellow-500 text-white",
    "out-of-stock": "bg-red-500 text-white",
  };

  return (
    <tr className="border-b border-gray-200 text-gray-600">
      <td data-cell={headers[0]} className="p-4">
        {index + 1}
      </td>
      <td data-cell={headers[1]} className="flex items-center gap-2 p-4">
        <img src={brand.imageUrl} alt={brand.name} className="h-6 w-6" />
        {brand.name}
      </td>
      <td data-cell={headers[2]} className="min-w-32 p-4">
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-medium",
            statusColors[status],
          )}
        >
          {status.replace("-", " ")}
        </span>
      </td>
      <td data-cell={headers[3]} className="p-4">
        {quantity}
      </td>
      <td data-cell={headers[4]} className="p-4">
        {brand.stockCount}
      </td>
    </tr>
  );
}

// Main Table Component
export default function CylinderTable() {
  const [selectedSize, setSelectedSize] = useState("12");
  const [selectedType, setSelectedType] = useState("20mm");

  // collect unique sizes & types across all brands
  const sizes = [
    ...new Set(brands.flatMap((b) => b.cylinders.map((c) => c.size))),
  ];
  const types = [
    ...new Set(brands.flatMap((b) => b.cylinders.map((c) => c.type))),
  ];

  return (
    <div className="w-[70%] p-4">
      {/* Filters as Buttons */}
      <div className="mb-4 flex flex-col gap-4">
        {/* Sizes */}
        <div className="flex items-center gap-2">
          <h2 className="text-gray-600">Size: </h2>
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(String(s))}
              className={clsx(
                "rounded border px-3 py-1 text-sm font-medium",
                selectedSize === String(s)
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
              )}
            >
              {s}L
            </button>
          ))}
        </div>

        {/* Types */}
        <div className="flex gap-2">
          <h2 className="text-gray-600">Type: </h2>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={clsx(
                "rounded border px-3 py-1 text-sm font-medium",
                selectedType === t
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse overflow-hidden rounded-md border bg-white tracking-wider shadow-sm">
        {/* <caption className="mb-4 rounded-lg bg-blue-400 p-2 font-bold tracking-wider text-white">
          {"LPG Stock Management".toUpperCase()}
        </caption> */}
        <TableHeader />
        <tbody>
          {brands.map((b, i) => (
            <TableRow
              key={b.id}
              brand={b}
              index={i}
              selectedSize={selectedSize}
              selectedType={selectedType}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
