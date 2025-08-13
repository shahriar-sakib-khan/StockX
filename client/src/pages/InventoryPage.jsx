import { BrandBox } from "../features";
import cylinderImg from "../assets/images/cylinderModel.png";

export default function InventoryPage() {
  // Temporary dummy brand data
  const brands = [
    {
      id: "brand1",
      name: "Omera Gas",
      imageUrl: cylinderImg,
      stockCount: 10,
      cylinders: [
        { type: "LPG", size: 12, quantity: 50 },
        { type: "LPG", size: 33, quantity: 30 },
        { type: "Industrial", size: 45, quantity: 10 },
      ],
    },
    {
      id: "brand2",
      name: "Bashundhara Gas",
      imageUrl: cylinderImg,
      stockCount: 20,
      cylinders: [
        { type: "LPG", size: 12, quantity: 40 },
        { type: "LPG", size: 33, quantity: 20 },
        { type: "Industrial", size: 45, quantity: 5 },
      ],
    },
    {
      id: "brand3",
      name: "TotalGaz",
      imageUrl: cylinderImg,
      stockCount: 12,
      cylinders: [
        { type: "LPG", size: 12, quantity: 25 },
        { type: "LPG", size: 33, quantity: 15 },
        { type: "Industrial", size: 45, quantity: 8 },
      ],
    },
  ];

  return (
    <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-wrap gap-2 bg-gray-100 p-2">
      {brands.map((brand) => (
        <BrandBox key={brand.id} brand={brand} />
      ))}
    </div>
  );
}
