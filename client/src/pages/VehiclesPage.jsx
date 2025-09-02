import { useState } from "react";
import { VehicleCard } from "../features";

export default function VehiclePage() {
    const [vehicleList, setVehicleList] = useState([
        {
            id: Date.now(),
            regNo: "ABC-1234",
            brand: "Toyota",
            model: "Corolla",
        },
        {
            id: Date.now(),
            regNo: "ABC-1234",
            brand: "Toyota",
            model: "Corolla",
        },
    ]);

    const onAdd = () => {
        const newVehicle = {
            id: Date.now(),
            regNo: "ABC-1234",
            brand: "Toyota",
            model: "Corolla",
        };
        setVehicleList((prev) => [...prev, newVehicle]);
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
                    onClick={onAdd}
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
        </div>
    );
}
