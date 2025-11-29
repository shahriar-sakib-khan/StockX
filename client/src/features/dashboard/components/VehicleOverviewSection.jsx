import { useNavigate } from "react-router-dom";
import { FaTruck, FaArrowRight, FaPlus, FaGasPump } from "react-icons/fa";
import { useAllVehicles } from "@/features/vehicle/hooks/vehicleHooks";
import { useAuthStore } from "@/stores/useAuthStore";
import { DashboardCard } from "./DashboardWidgets";

export default function VehicleOverviewSection() {
    const navigate = useNavigate();
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const { data: vehicles = [] } = useAllVehicles(storeId);

    const previewVehicles = vehicles.slice(0, 3); // Top 3

    return (
        <DashboardCard title="Active Fleet" icon={FaTruck} className="h-full">
            <div className="flex flex-col gap-3">
                {previewVehicles.length > 0 ? (
                    previewVehicles.map((vehicle) => (
                        <div key={vehicle.id ?? vehicle._id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:border-gray-200 hover:shadow-sm">
                            <div className="flex items-center gap-3">
                                {/* Avatar / Image */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200 overflow-hidden">
                                    {vehicle.image ? (
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.vehicleBrand}
                                            className="h-full w-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                    ) : null}
                                    {/* Fallback Icon */}
                                    <div
                                        className="hidden h-full w-full items-center justify-center bg-gray-100 text-gray-400"
                                        style={{ display: vehicle.image ? 'none' : 'flex' }}
                                    >
                                        <FaTruck size={14} />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">
                                        {vehicle.vehicleBrand ?? vehicle.brand}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-mono">
                                        {vehicle.regNumber ?? vehicle.regNo}
                                    </p>
                                </div>
                            </div>

                            {/* Action / Status */}
                            <button
                                className="flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600 hover:bg-orange-100"
                                title="Log Fuel Cost"
                            >
                                <FaGasPump /> Fuel
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center text-sm text-gray-400">
                        No vehicles added.
                    </div>
                )}

                <div className="mt-2 flex gap-3">
                    <button
                        onClick={() => navigate("/vehicles")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        View All
                    </button>
                    <button
                        onClick={() => navigate("/vehicles")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <FaPlus size={10} /> Add
                    </button>
                </div>
            </div>
        </DashboardCard>
    );
}
