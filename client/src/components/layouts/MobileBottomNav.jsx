import { NavLink } from "react-router-dom";
import { pagesConfig } from "@/pages/utils/pagesConfig";

export default function MobileBottomNav() {
    // Icon Mappings
    const DashboardIcon = pagesConfig["/dashboard"]?.icon;
    const InventoryIcon = pagesConfig["/inventory"]?.icon;
    const ShopIcon = pagesConfig["/shops"]?.icon;
    const VehicleIcon = pagesConfig["/vehicles"]?.icon;
    const HistoryIcon = pagesConfig["/history"]?.icon;
    const StaffIcon = pagesConfig["/staff"]?.icon;
    const CommunityIcon = pagesConfig["/community"]?.icon;

    const navItem = (Icon, label, link) => (
        <NavLink
            to={link}
            // Increased min-width for bigger touch targets
            // Adjusted padding and font size
            className={({ isActive }) =>
                `flex min-w-[5rem] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                        ? "text-indigo-600"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {/* SIGNIFICANTLY INCREASED ICON SIZE (h-7 w-7 is approx 28px) */}
                    <Icon className={`h-7 w-7 ${isActive ? "text-indigo-600" : "text-gray-500"}`} />
                    <span className="truncate max-w-full px-1">{label}</span>
                </>
            )}
        </NavLink>
    );

    return (
        // Increased height slightly to h-16 (64px) if var is too small, otherwise keep var
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[var(--navbar-height)] min-h-[64px] w-full items-center border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden">
            <div className="flex h-full w-full overflow-x-auto no-scrollbar">
                {navItem(DashboardIcon, "Home", "/dashboard")}
                {navItem(InventoryIcon, "Inventory", "/inventory")}
                {navItem(ShopIcon, "Shops", "/shops")}
                {navItem(VehicleIcon, "Vehicles", "/vehicles")}
                {navItem(HistoryIcon, "History", "/history")}
                {navItem(StaffIcon, "Staff", "/staff")}
                {navItem(CommunityIcon, "Community", "/community")}
            </div>
        </nav>
    );
}
