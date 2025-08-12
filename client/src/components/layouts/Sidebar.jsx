import { LuSquareChevronLeft as MenuIcon } from "react-icons/lu";
import { pagesConfig } from "../../pages/utils/pagesConfig";
import { NavLink } from "react-router-dom";
import DivisionMenu from "../ui/DivisionMenu";
import { useUIStore } from "../../stores/useUIStore";

export default function Sidebar() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleMenu = useUIStore((state) => state.toggleMenu);
  // const isAdmin = false;
  const DashboardIcon = pagesConfig["/dashboard"]?.icon;
  const InventoryIcon = pagesConfig["/inventory"]?.icon;
  const ShopIcon = pagesConfig["/shops"]?.icon;
  const VehicleIcon = pagesConfig["/vehicles"]?.icon;
  const HistoryIcon = pagesConfig["/history"]?.icon;

  const heading = (headingText) => (
    <h2
      className={`pointer-events-none mb-2 overflow-hidden text-sm font-semibold transition-all ${isSidebarOpen ? "w-full" : "w-0"}`}
    >
      {headingText.toUpperCase()}
    </h2>
  );

  const navItem = (icon, text, link) => (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `group relative flex items-center border-l-3 p-1 pl-2 text-gray-700 ${
          isActive
            ? "border-green-500 bg-gray-100"
            : "border-transparent hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <h3
        className={`overflow-hidden transition-all ${isSidebarOpen ? "grow-1 pl-2" : "w-0"}`}
      >
        {text}
      </h3>
      {!isSidebarOpen && (
        <h3
          className={`invisible absolute left-full translate-x-0 rounded bg-white p-1.5 opacity-20 shadow-md transition-all group-hover:visible group-hover:translate-x-6 group-hover:opacity-100`}
        >
          {text}
        </h3>
      )}
    </NavLink>
  );

  return (
    <aside
      className={`flex h-[var(--height-with-nav)] flex-col border-r-1 border-gray-200 text-gray-700 transition-all ${isSidebarOpen ? "w-[var(--sidebar-width)]" : "w-15"}`}
    >
      <div
        className={`mb-4 flex h-[var(--titlebar-height)] items-center justify-between border-b-1 border-gray-300 bg-gray-100 p-3 text-gray-800`}
      >
        <DivisionMenu />
        <button
          className="rounded p-1 transition-all hover:bg-gray-200"
          onClick={() => toggleMenu("isSidebarOpen")}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <MenuIcon
            className={`text-2xl text-gray-500 ${isSidebarOpen ? "rotate-0" : "rotate-180"} transition-transform`}
          />
        </button>
      </div>
      <div className={`flex flex-col gap-4 px-3`}>
        <nav aria-label="General">
          {heading("GENERAL")}
          <div className="flex flex-col gap-2">
            {navItem(
              <DashboardIcon className="shrink-0 text-xl text-gray-700" />,
              "Dashboard",
              "/dashboard",
            )}
            {navItem(
              <InventoryIcon className="shrink-0 text-xl text-gray-700" />,
              "Inventory",
              "/inventory",
            )}
            {navItem(
              <ShopIcon className="shrink-0 text-xl text-gray-700" />,
              "Shops",
              "/shops",
            )}
            {navItem(
              <VehicleIcon className="shrink-0 text-xl text-gray-700" />,
              "Vehicles",
              "/vehicles",
            )}
            {navItem(
              <HistoryIcon className="shrink-0 text-xl text-gray-700" />,
              "History",
              "/history",
            )}
          </div>
        </nav>
        {/* <nav
          aria-label="My Account"
        >
          {heading("MY ACCOUNT")}
          <div className="flex flex-col gap-1">
            {navItem("Profile", "/profile")}
            {navItem("Settings", "/settings")}
          </div>
        </nav>
        {isAdmin && (
          <nav aria-label="Admin Panel">
            {heading("ADMIN PANEL")}
            <div className="flex flex-col gap-1">
              {navItem("Users", "/users")}
              {navItem("Statistics", "/statistics")}
            </div>
          </nav>
        )} */}
      </div>
    </aside>
  );
}
