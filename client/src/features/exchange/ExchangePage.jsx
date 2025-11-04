import { useState } from "react";
import ShopSelector from "./ShopSelector";
import CylinderSection from "./CylinderSection";
import CylinderModal from "./CylinderModal";
import { shops } from "./data";
import { Modal, Button } from "@/components";

export default function ExchangePage() {
    const [selectedShop, setSelectedShop] = useState(null);
    const [giving, setGiving] = useState([]);
    const [taking, setTaking] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
    const [showSummary, setShowSummary] = useState(false);

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedType, setSelectedType] = useState("22");
    const [selectedSize, setSelectedSize] = useState("12");
    const [count, setCount] = useState(1);
    const [editItem, setEditItem] = useState(null);

    const resetModal = () => {
        setSelectedBrand(null);
        setSelectedType("22");
        setSelectedSize("12");
        setCount(1);
        setEditItem(null);
    };

    const handleAddCylinder = () => {
        if (!selectedBrand) return;
        const entry = {
            id: editItem ? editItem.id : Date.now(),
            brand: selectedBrand,
            type: selectedType,
            size: selectedSize,
            count,
        };

        if (activeModal === "giving") {
            setGiving((prev) =>
                editItem
                    ? prev.map((i) => (i.id === editItem.id ? entry : i))
                    : [...prev, entry],
            );
        } else {
            setTaking((prev) =>
                editItem
                    ? prev.map((i) => (i.id === editItem.id ? entry : i))
                    : [...prev, entry],
            );
        }

        resetModal();
        setActiveModal(null);
    };

    const handleDelete = (list, setList, id) =>
        setList(list.filter((i) => i.id !== id));

    const handleEdit = (item, modalType) => {
        setEditItem(item);
        setSelectedBrand(item.brand);
        setSelectedType(item.type);
        setSelectedSize(item.size);
        setCount(item.count);
        setActiveModal(modalType);
    };

    return (
        <div className="relative min-h-screen bg-gray-50 p-6">
            <ShopSelector
                shops={shops}
                selectedShop={selectedShop}
                setSelectedShop={setSelectedShop}
            />

            {!selectedShop ? (
                <p className="text-center text-gray-400 italic">
                    Please select a shop to begin.
                </p>
            ) : (
                <>
                    <div className="mb-8 flex items-center justify-center gap-3">
                        <h2 className="rounded-xl bg-blue-50 px-6 py-2 text-lg font-semibold text-blue-700 shadow-sm">
                            🏪 {selectedShop.name}
                        </h2>
                        <Button
                            label="Change Shop"
                            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-100"
                            onClick={() => setSelectedShop(null)}
                        />
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <CylinderSection
                            title="Full Cylinders (Giving)"
                            color="green"
                            cylinders={giving}
                            onAdd={() => setActiveModal("giving")}
                            onEdit={(c) => handleEdit(c, "giving")}
                            onDelete={(id) =>
                                handleDelete(giving, setGiving, id)
                            }
                        />

                        <CylinderSection
                            title="Empty Cylinders (Taking)"
                            color="blue"
                            cylinders={taking}
                            onAdd={() => setActiveModal("taking")}
                            onEdit={(c) => handleEdit(c, "taking")}
                            onDelete={(id) =>
                                handleDelete(taking, setTaking, id)
                            }
                        />
                    </div>

                    {(giving.length > 0 || taking.length > 0) && (
                        <div className="mt-10 flex justify-center">
                            <Button
                                label="Done"
                                className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                                onClick={() => setShowSummary(true)}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Cylinder Modal */}
            <CylinderModal
                isOpen={!!activeModal}
                onClose={() => {
                    resetModal();
                    setActiveModal(null);
                }}
                modalType={activeModal}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                count={count}
                setCount={setCount}
                editItem={editItem}
                onSubmit={handleAddCylinder}
            />

            {/* Transaction Summary Modal */}
            <Modal
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                title="Exchange Summary"
                size="lg"
                footer={
                    <div className="flex justify-end gap-4">
                        <Button
                            label="Print Memo"
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => setShowSummary(false)}
                        />
                        <Button
                            label="Save Memo"
                            className="bg-blue-500 text-white hover:bg-blue-600"
                            onClick={() => setShowSummary(false)}
                        />
                    </div>
                }
            >
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-green-600">
                            Giving Cylinders
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            {giving.length ? (
                                giving.map((c) => (
                                    <li
                                        key={c.id}
                                        className="rounded border border-gray-100 bg-green-50 px-3 py-2"
                                    >
                                        {c.brand.name} — {c.size}kg — {c.type}mm
                                        × {c.count}
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-400 italic">
                                    No giving cylinders
                                </p>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-blue-600">
                            Taking Cylinders
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            {taking.length ? (
                                taking.map((c) => (
                                    <li
                                        key={c.id}
                                        className="rounded border border-gray-100 bg-blue-50 px-3 py-2"
                                    >
                                        {c.brand.name} — {c.size}kg — {c.type}mm
                                        × {c.count}
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-400 italic">
                                    No taking cylinders
                                </p>
                            )}
                        </ul>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
