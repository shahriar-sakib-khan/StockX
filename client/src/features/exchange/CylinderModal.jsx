import { Modal, Button } from "@/components";
import { sizes, types, cylinders, brands } from "./data";
import { ArrowLeft } from "lucide-react";

export default function CylinderModal({
    isOpen,
    onClose,
    modalType,
    selectedBrand,
    setSelectedBrand,
    selectedType,
    setSelectedType,
    selectedSize,
    setSelectedSize,
    count,
    setCount,
    editItem,
    onSubmit,
}) {
    const selectedCylinder = cylinders.find(
        (c) => c.brandName === selectedBrand?.name,
    );
    const availableStock = selectedCylinder?.fullCount || 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                modalType === "giving"
                    ? editItem
                        ? "Edit Empty Cylinder"
                        : "Add Empty Cylinder"
                    : editItem
                      ? "Edit Full Cylinder"
                      : "Add Full Cylinder"
            }
            size="md"
            footer={
                selectedBrand && (
                    <div className="flex w-full items-center justify-between">
                        {/* Back Button */}
                        <Button
                            label="Back"
                            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200"
                            onClick={() => setSelectedBrand(null)}
                        >
                            <ArrowLeft size={16} />
                            <span>Brand Selection</span>
                        </Button>

                        {/* Done / Update Button */}
                        <Button
                            label={editItem ? "Update" : "Done"}
                            className="rounded-lg bg-blue-500 px-4 py-1.5 text-white hover:bg-blue-600"
                            onClick={onSubmit}
                            disabled={!selectedBrand}
                        />
                    </div>
                )
            }
        >
            {/* Brand Selection Modal */}
            {!selectedBrand ? (
                <div className="grid grid-cols-3 gap-3">
                    {brands.map((b) => (
                        <button
                            key={b.id}
                            onClick={() => setSelectedBrand(b)}
                            className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-blue-400 hover:bg-blue-50"
                        >
                            <img
                                src={b.brandImage}
                                alt={b.name}
                                className="mb-2 h-10 object-contain"
                            />
                            <span className="text-sm font-medium text-gray-700 capitalize">
                                {b.name}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                <>
                    {/* Prominent Brand Header */}
                    <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 py-3">
                        <img
                            src={selectedBrand.brandImage}
                            alt={selectedBrand.name}
                            className="h-8 w-8 object-contain"
                        />
                        <span className="text-lg font-bold tracking-wide text-blue-700 capitalize">
                            {selectedBrand.name}
                        </span>
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Count Input Section */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">
                                Count
                            </label>

                            {/* Highlighted Available Stock */}
                            <div className="mb-2 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Available Stock:
                                </span>
                                <span className="text-base font-bold text-blue-700">
                                    {availableStock}
                                </span>
                            </div>

                            <input
                                type="number"
                                min="1"
                                className="w-full rounded-lg border border-gray-200 p-2 text-gray-700 focus:border-blue-400 focus:outline-none"
                                value={count}
                                onChange={(e) =>
                                    setCount(Number(e.target.value))
                                }
                            />
                        </div>

                        {/* Size Selection */}
                        <div>
                            <p className="mb-1 text-sm font-medium text-gray-600">
                                Size (kg)
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((s) => (
                                    <button
                                        key={s}
                                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                                            selectedSize === s
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 text-gray-700 hover:border-blue-300"
                                        }`}
                                        onClick={() => setSelectedSize(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Regulator Type Selection */}
                        <div>
                            <p className="mb-1 text-sm font-medium text-gray-600">
                                Regulator Type
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {types.map((t) => (
                                    <button
                                        key={t}
                                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                                            selectedType === t
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-gray-200 text-gray-700 hover:border-blue-300"
                                        }`}
                                        onClick={() => setSelectedType(t)}
                                    >
                                        {t} mm
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
}
