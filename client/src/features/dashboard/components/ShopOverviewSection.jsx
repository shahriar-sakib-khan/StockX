import { useNavigate } from "react-router-dom";
import { FaStore, FaPlus } from "react-icons/fa";
import { useAllShops } from "@/features/shop/hooks/shopHooks";
import { useAuthStore } from "@/stores/useAuthStore";
import { DashboardCard } from "./DashboardWidgets";

export default function ShopOverviewSection() {
    const navigate = useNavigate();
    const storeId = useAuthStore((s) => s.currentStore?.id);
    const { data: shops = [] } = useAllShops(storeId);

    const previewShops = shops.slice(0, 3);

    return (
        <DashboardCard title="My Customer Shops" icon={FaStore} className="h-full">
            <div className="flex flex-col gap-3">
                {previewShops.length > 0 ? (
                    previewShops.map((shop) => (
                        <div key={shop.id ?? shop._id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:border-gray-200">
                            <div className="flex items-center gap-3">
                                {/* Avatar / Image */}
                                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 border border-indigo-50 overflow-hidden">
                                    {shop.image ? (
                                        <img
                                            src={shop.image}
                                            alt={shop.shopName}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}

                                    {/* Fallback Initials */}
                                    <div
                                        className="hidden h-full w-full items-center justify-center text-xs font-bold text-indigo-600"
                                        style={{ display: shop.image ? 'none' : 'flex' }}
                                    >
                                        {shop.shopName?.substring(0, 1).toUpperCase()}
                                    </div>
                                </div>

                                <div className="overflow-hidden">
                                    <h4 className="truncate text-sm font-bold text-gray-800">{shop.shopName}</h4>
                                    <p className="truncate text-xs text-gray-500">{shop.location}</p>
                                </div>
                            </div>

                            {/* Due Amount */}
                            <div className="text-right">
                                <span className={`block text-sm font-bold ${shop.totalDue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    ৳ {shop.totalDue}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase">Total Due</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center text-sm text-gray-400">
                        No shops added yet.
                    </div>
                )}

                <div className="mt-2 flex gap-3">
                    <button
                        onClick={() => navigate("/shops")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        View All
                    </button>
                    <button
                        onClick={() => navigate("/shops")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <FaPlus size={10} /> Add Shop
                    </button>
                </div>
            </div>
        </DashboardCard>
    );
}
