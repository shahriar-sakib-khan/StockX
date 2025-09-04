import { useState } from "react";
import { VehicleCard } from "../features";
import { ModalContainer, Spinner } from "../components";
import TestVehicles from "../features/vehicle/components/TestVehicles";

export default function VehiclePage() {
    const [vehicleList, setVehicleList] = useState([
        {
            id: 1,
            brand: "Toyota",
            model: "Corolla",
            regNo: "ABC-1234",
        },
        {
            id: 2,
            brand: "Ford",
            model: "F-150",
            regNo: "DEF-5678",
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        regNo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newVehicle = {
            id: Date.now(),
            ...formData,
        };
        setVehicleList((prev) => [...prev, newVehicle]);
        setFormData({ regNo: "", brand: "", model: "" });
        setIsModalOpen(false);
    };

    const onDelete = (id) => {
        setVehicleList((prev) => prev.filter((vehicle) => vehicle.id !== id));
    };

    return (
        <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col gap-6 bg-gray-100 pt-5 text-gray-700">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-2xl font-semibold text-gray-500">
                    Vehicle List
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="primary-button flex items-center gap-3 px-3 py-1"
                >
                    Add Vehicle
                    <span className="text-xl">+</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-5">
                {vehicleList.map((vehicle) => (
                    <VehicleCard
                        key={vehicle.id}
                        vehicleInfo={vehicle}
                        onDelete={() => onDelete(vehicle.id)}
                    />
                ))}
            </div>
            <TestVehicles />

            {/* Modal */}
            {isModalOpen && (
                <ModalContainer
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-semibold text-gray-600">
                            Add New Vehicle
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3"
                        >
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Brand"
                                className="rounded border border-gray-300 px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="Model"
                                className="rounded border border-gray-300 px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="regNo"
                                value={formData.regNo}
                                onChange={handleChange}
                                placeholder="Registration No"
                                className="rounded border border-gray-300 px-3 py-2"
                                required
                            />
                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
}
