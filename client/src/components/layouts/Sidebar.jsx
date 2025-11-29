import { NavLink } from "react-router-dom";
import { LuSquareChevronLeft as MenuIcon } from "react-icons/lu";

import { useUIStore } from "@/stores/useUIStore";
import { pagesConfig } from "@/pages/utils/pagesConfig";
// Using the alias as requested
import { StoreMenu } from "@/components";

export default function Sidebar() {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const toggleMenu = useUIStore((state) => state.toggleMenu);

    // Icon Mappings
    const DashboardIcon = pagesConfig["/dashboard"]?.icon;
    const InventoryIcon = pagesConfig["/inventory"]?.icon;
    const ShopIcon = pagesConfig["/shops"]?.icon;
    const VehicleIcon = pagesConfig["/vehicles"]?.icon;
    const HistoryIcon = pagesConfig["/history"]?.icon;
    const StaffIcon = pagesConfig["/staff"]?.icon;
    const CommunityIcon = pagesConfig["/community"]?.icon;

    const sideBarHeading = (headingText) => (
        <h2
            className={`pointer-events-none mb-3 overflow-hidden text-xs font-semibold tracking-wider text-gray-500 transition-all duration-300 ${
                isSidebarOpen ? "w-full opacity-100" : "w-0 opacity-0 lg:w-0"
            }`}
        >
            {headingText.toUpperCase()}
        </h2>
    );

    const navItem = (icon, text, link) => (
        <NavLink
            to={link}
            className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
            }
        >
            <span className="shrink-0 text-xl">{icon}</span>
            <span
                className={`whitespace-nowrap transition-all duration-300 ${
                    isSidebarOpen ? "w-auto opacity-100" : "w-0 overflow-hidden opacity-0 lg:w-0"
                }`}
            >
                {text}
            </span>

            {!isSidebarOpen && (
                <div className="absolute left-full ml-2 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg group-hover:block group-hover:opacity-100 lg:block z-50">
                    {text}
                </div>
            )}
        </NavLink>
    );

    return (
        <aside
            className={`hidden h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out lg:flex ${
                isSidebarOpen
                    ? "w-[var(--sidebar-width-lg)]"
                    : "w-[var(--sidebar-width-sm)]"
            }`}
        >
            <div className="flex h-[var(--titlebar-height)] items-center justify-between border-b border-gray-200 bg-gray-50 px-3">
                <div className={`transition-all duration-300 ${isSidebarOpen ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0 lg:w-0"}`}>
                        <StoreMenu />
                </div>

                <button
                    className="rounded p-1.5 text-gray-500 hover:bg-gray-200"
                    onClick={() => toggleMenu("isSidebarOpen")}
                >
                    <MenuIcon
                        className={`text-xl transition-transform duration-300 ${
                            isSidebarOpen ? "rotate-0" : "rotate-180"
                        }`}
                    />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-200">
                <nav className="flex flex-col gap-1">
                    {sideBarHeading("General")}
                    {navItem(<DashboardIcon />, "Dashboard", "/dashboard")}
                    {navItem(<InventoryIcon />, "Inventory", "/inventory")}
                    {navItem(<ShopIcon />, "Shops", "/shops")}
                    {navItem(<VehicleIcon />, "Vehicles", "/vehicles")}
                    {navItem(<HistoryIcon />, "History", "/history")}
                    {navItem(<StaffIcon />, "Staff", "/staff")}
                    {navItem(<CommunityIcon />, "Community", "/community")}
                </nav>
            </div>
        </aside>
    );
}
