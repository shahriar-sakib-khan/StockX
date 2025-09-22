import { useEffect } from "react";
import {
    InventoryOverviewSection,
    QuickActionsSection,
    StatsSection,
} from "../features";
import { Heading } from "../features/dashboard/utils/Heading";
import { Section } from "../features/dashboard/utils/Section";
import { useUIStore } from "../stores/useUIStore";
import { PiWallet as WalletIcon } from "react-icons/pi";
import { useAuthStore } from "../stores/useAuthStore";
import { logOnce } from "./utils/logOnce";


export default function Dashboard() {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const user = useAuthStore((state) => state.user);

    const allStores = useAuthStore((state) => state.allStores);
    const setAllStores = useAuthStore((state) => state.setAllStores);
    const setCurrentStore = useAuthStore((state) => state.setCurrentStore);
    const store = useAuthStore((state) => state.currentStore);

    // Logging safely in useEffect to avoid double logs in React 18 Strict Mode
    useEffect(() => {
        logOnce("👤 User from DB:", user);
        logOnce("👤 Current Store:", store);
        logOnce("👤 Current Stores:", allStores);
    }, [user]);

    return (
        <div className="grid h-[var(--height-with-nav-titlebar)] grid-cols-[auto_1fr] bg-amber-50">
            <main
                className={`flex flex-col gap-4 overflow-auto bg-gray-50 transition-all ${
                    isSidebarOpen
                        ? "w-[var(--width-with-sidebar-lg-rightbar)]"
                        : "w-[var(--width-with-sidebar-sm-rightbar)]"
                }`}
            >
                <StatsSection />
                <QuickActionsSection />
                <InventoryOverviewSection />

                <Section>
                    <Heading>Graph</Heading>
                    <div className="h-40 bg-blue-100"></div>
                </Section>
                <Section>
                    <Heading>Recents</Heading>
                    <div className="flex flex-col gap-4">
                        <div className="h-5 bg-red-100"></div>
                        <div className="h-5 bg-red-100"></div>
                        <div className="h-5 bg-red-100"></div>
                        <div className="h-5 bg-red-100"></div>
                    </div>
                </Section>
                <Section>
                    <Heading>Custormer Shops</Heading>
                    <div className="grid grid-cols-[1rem_1fr_1rem] gap-2">
                        <button className="flex self-center px-0.5 font-bold">{`<`}</button>
                        <div className="grid h-30 grid-cols-4 gap-2">
                            <div className="h-30 bg-purple-200"></div>
                            <div className="h-30 bg-purple-200"></div>
                            <div className="h-30 bg-purple-200"></div>
                            <div className="h-30 bg-purple-200"></div>
                        </div>
                        <button className="flex self-center px-0.5 font-bold">{`>`}</button>
                    </div>
                    <button className="mt-2 w-full bg-green-100 text-center text-green-700">
                        View all
                    </button>
                </Section>
                <Section>
                    <Heading>Vehicles</Heading>
                    <div className="grid grid-cols-[1rem_1fr_1rem] gap-2">
                        <button className="flex self-center px-0.5 font-bold">{`<`}</button>
                        <div className="grid h-30 grid-cols-4 gap-2">
                            <div className="h-30 bg-red-200"></div>
                            <div className="h-30 bg-red-200"></div>
                            <div className="h-30 bg-red-200"></div>
                            <div className="h-30 bg-red-200"></div>
                        </div>
                        <button className="flex self-center px-0.5 font-bold">{`>`}</button>
                    </div>
                    <button className="mt-2 w-full bg-green-100 text-center text-green-700">
                        View all
                    </button>
                </Section>
            </main>
            <aside className="flex w-[var(--rightbar-width)] flex-col border-l border-gray-300 bg-gray-50">
                <Section>
                    <div className="flex gap-4 rounded-md border border-gray-200 bg-white py-3">
                        <div className="flex flex-col gap-2">
                            <div className="ml-3 flex items-center gap-2">
                                <WalletIcon className="size-8 rounded-sm bg-blue-100 p-1 text-2xl text-blue-600" />
                                <h2 className="text-lg text-gray-400">Balance</h2>
                            </div>
                            <div className="mt-1 w-full pl-2 text-left">
                                <span className={`text-3xl font-semibold text-gray-600`}>
                                    {"15,000".toLocaleString()}
                                </span>{" "}
                                <span className={`text-sm`}>Tk</span>
                            </div>
                        </div>
                        <div className="mr-2 grow rounded-sm bg-gray-100"></div>
                    </div>
                </Section>
                <Section>
                    <div className="h-30 bg-gray-100"></div>
                </Section>
            </aside>
        </div>
    );
}
