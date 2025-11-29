import { useEffect } from "react";

// Icons
import { PiWallet as WalletIcon } from "react-icons/pi";
import { FaChartLine, FaHistory } from "react-icons/fa";

import { useAuthStore } from "@/stores/useAuthStore";
import { logOnce } from "./utils/logOnce";

// Internal Components
import { DashboardCard } from "@/features/dashboard/components/DashboardWidgets";
import { DemoSalesChart, DemoActivityList } from "@/features/dashboard/components/DemoWidgets";

import {
    QuickActionsSection,
    StatsSection,
    InventoryOverviewSection,
    ShopOverviewSection,
    VehicleOverviewSection
} from "@/features";

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const store = useAuthStore((state) => state.currentStore);

    useEffect(() => {
        logOnce("👤 User from DB:", user);
    }, [user]);

    return (
        <div className="flex flex-col gap-6 pb-24 lg:pb-6">

            {/* --- ROW 1: WALLET + STATS --- */}
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-6">
                <div className="w-full lg:col-span-1">
                    <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-5 text-white shadow-lg shadow-indigo-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-indigo-100 uppercase tracking-wider">Balance</p>
                                <h2 className="mt-1 text-3xl font-bold">
                                    ৳ {"15,000".toLocaleString()}
                                </h2>
                            </div>
                            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                                <WalletIcon className="text-xl text-white" />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                            <span className="text-xs font-medium text-indigo-100">+2.5% this week</span>
                            <button className="text-xs font-bold hover:underline">View History &rarr;</button>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:col-span-3">
                     <StatsSection />
                </div>
            </div>

            {/* --- ROW 2: QUICK ACTIONS --- */}
            <div className="w-full">
                <QuickActionsSection />
            </div>

            {/* --- ROW 3: INVENTORY (Main) --- */}
            <div className="w-full">
                <InventoryOverviewSection />
            </div>

            {/* --- ROW 4: SHOPS & VEHICLES --- */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ShopOverviewSection />
                <VehicleOverviewSection />
            </div>

            {/* --- ROW 5: ANALYTICS (Demo) --- */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DashboardCard title="Sales Trend" icon={FaChartLine}>
                    <div className="h-64 w-full">
                        <DemoSalesChart />
                    </div>
                </DashboardCard>

                <DashboardCard title="Recent Activity" icon={FaHistory}>
                    <DemoActivityList />
                </DashboardCard>
            </div>
        </div>
    );
}
