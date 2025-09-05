import DefaultImage from "@/assets/images/vehicle_icon.png";
import { RiDeleteBin5Line as DeleteIcon } from "react-icons/ri";

export default function VehicleCard({ vehicleInfo, onDelete, onUpdate }) {
    return (
        <div className="flex w-70 flex-col overflow-hidden rounded-md bg-white text-nowrap text-gray-600 shadow-lg ring-1 ring-gray-200">
            {/* Top section (vehicle image + delete) */}
            <section className="relative flex items-center justify-center bg-gray-100/90">
                <img
                    src={vehicleInfo?.image || DefaultImage}
                    alt={vehicleInfo?.regNo || "Vehicle"}
                    className="h-40 rounded-t-md object-cover"
                />
                <button
                    onClick={onDelete}
                    className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-white/70 shadow hover:bg-red-50"
                >
                    <DeleteIcon className="size-5 text-red-500/80" />
                </button>
            </section>

            {/* Vehicle info section */}
            <section className="flex flex-col gap-1 px-6 py-4">
                <span className="text-lg font-semibold text-gray-700">
                    {vehicleInfo?.brand || "Unknown Brand"}{" "}
                    {vehicleInfo?.model || "Unknown Model"}
                </span>
                <span className="text-sm text-gray-500">
                    Reg: {vehicleInfo?.regNo || "No Reg No."}
                </span>
            </section>

            {/* Buttons Section */}
            <section className="mt-2 mb-4 flex items-center justify-center gap-3 px-4">
                <button className="primary-button px-4 py-1">
                    Fuel / Repair
                </button>
                <button className="rounded bg-gray-200 px-4 py-1 hover:bg-gray-300/70">
                    History
                </button>
            </section>
            <button
                onClick={onUpdate}
                className="bg-yellow-400/90 px-4 py-1 text-white transition-all duration-100 hover:bg-yellow-500/80"
            >
                Update
            </button>
        </div>
    );
}
