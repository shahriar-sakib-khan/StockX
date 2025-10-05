import { useState } from "react";
import clsx from "clsx";
import cylinderImg from "@/assets/images/cylinderModel.png";
import stoveImg from "@/assets/images/stoveModel.png"; // add stove image
import regulatorImg from "@/assets/images/regulatorModel.png"; // add regulator image
import { TableHeader } from "../utils/TableHeader";
import { TableRow } from "../utils/TableRow";
import SearchBar from "./SearchBar";

const brands = [
    // Cylinders
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
    {
        id: "brand4",
        name: "Nigaz",
        imageUrl: cylinderImg,
        stockCount: 17,
        cylinders: [
            { type: "20mm", size: 12, quantity: 18 },
            { type: "22mm", size: 45, quantity: 9 },
            { type: "22mm", size: 33, quantity: 11 },
        ],
    },

    // Stoves
    {
        id: "stove1",
        name: "Miyako Stove",
        imageUrl: stoveImg,
        stockCount: 15,
        stoves: [
            { type: "Single Burner", size: "small", quantity: 12 },
            { type: "Double Burner", size: "large", quantity: 8 },
        ],
    },
    {
        id: "stove2",
        name: "Vision Stove",
        imageUrl: stoveImg,
        stockCount: 10,
        stoves: [
            { type: "Single Burner", size: "small", quantity: 5 },
            { type: "Double Burner", size: "large", quantity: 3 },
        ],
    },

    // Regulators
    {
        id: "reg1",
        name: "Walton Regulator",
        imageUrl: regulatorImg,
        stockCount: 25,
        regulators: [
            { type: "20mm", size: "standard", quantity: 20 },
            { type: "22mm", size: "heavy", quantity: 5 },
        ],
    },
    {
        id: "reg2",
        name: "Singer Regulator",
        imageUrl: regulatorImg,
        stockCount: 18,
        regulators: [
            { type: "20mm", size: "standard", quantity: 10 },
            { type: "22mm", size: "heavy", quantity: 4 },
        ],
    },
];

const headers = ["#", "Brand", "Status", "Full", "Empty", "Action"];

// Main Table Component
export default function InventoryTable({ overview = false, brandCount, type }) {
    const [selectedSize, setSelectedSize] = useState("12");
    const [selectedType, setSelectedType] = useState("20mm");
    const [searchTerm, setSearchTerm] = useState("");

    const typeMap = {
        cylinders: "cylinder",
        stoves: "stove",
        regulators: "regulator",
    };

    const product = typeMap[type] || type;

    // collect unique sizes & types across all brands for this type
    let sizes = [];
    let types = [];
    if (type === "cylinders") {
        sizes = [...new Set(brands.flatMap((b) => b.cylinders?.map((c) => c.size) || []))];
        types = [...new Set(brands.flatMap((b) => b.cylinders?.map((c) => c.type) || []))];
    } else if (type === "stoves") {
        sizes = [...new Set(brands.flatMap((b) => b.stoves?.map((s) => s.size) || []))];
        types = [...new Set(brands.flatMap((b) => b.stoves?.map((s) => s.type) || []))];
    } else if (type === "regulators") {
        sizes = [...new Set(brands.flatMap((b) => b.regulators?.map((r) => r.size) || []))];
        types = [...new Set(brands.flatMap((b) => b.regulators?.map((r) => r.type) || []))];
    }

    // filter brands by search term
    let displayedBrands =
        typeof brandCount === "number" ? brands.slice(0, brandCount) : brands;

    if (searchTerm.trim() !== "") {
        displayedBrands = displayedBrands.filter((b) =>
            b.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }

    return (
        <div className="w-full bg-transparent p-4">
            {/* Search & Filters */}
            <div className="mb-4 flex gap-16 items-center">
                {!overview && (
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder={`Search ${product}...`}
                        className="w-100"
                    />
                )}

                {/* Sizes — invisible placeholder when not cylinders */}
                <div
                    className={clsx(
                        "ml-auto flex items-center gap-2 transition-all",
                        type !== "cylinders" && "invisible"
                    )}
                >
                    <h2 className="text-gray-600">Size: </h2>
                    {sizes.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSelectedSize(String(s))}
                            className={clsx(
                                "rounded border px-3 py-1 text-sm font-medium",
                                selectedSize === String(s)
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Types */}
                <div className="flex items-center gap-2">
                    <h2 className="text-gray-600">Type: </h2>
                    {types.map((t) => (
                        <button
                            key={t}
                            onClick={() => setSelectedType(t)}
                            className={clsx(
                                "rounded border px-3 py-1 text-sm font-medium",
                                selectedType === t
                                    ? "border-emerald-500 bg-emerald-500 text-white"
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
                <thead className="bg-gray-200/75 text-left text-sm font-semibold text-gray-600">
                    <TableHeader headers={headers} />
                </thead>
                <tbody>
                    {displayedBrands
                        .filter((b) => b[`${product}s`]) // only show correct type
                        .map((b, i) => (
                            <TableRow
                                key={b.id}
                                brand={b}
                                index={i}
                                selectedSize={selectedSize}
                                selectedType={selectedType}
                                headers={headers}
                                type={type}
                                onEdit={() => {}}
                                onDelete={() => {}}
                            />
                        ))}
                </tbody>
            </table>
        </div>
    );
}
