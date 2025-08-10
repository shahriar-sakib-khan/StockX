import { LuSquareChevronLeft as MenuIcon } from "react-icons/lu";
import { LuLayoutDashboard as DashboardIcon } from "react-icons/lu";
import { MdOutlineInventory2 as InventoryIcon } from "react-icons/md";
import { AiOutlineShop as ShopIcon } from "react-icons/ai";
import { HiOutlineTruck as VehicleIcon } from "react-icons/hi2";
import { FaRegClock as HistoryIcon } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  // const isAdmin = false;
  const currentWorkspace = "My workspace";

  const heading = (headingText) => (
    <h2
      className={`mb-2 overflow-hidden text-sm font-semibold transition-all ${open ? "w-full" : "w-0"}`}
    >
      {headingText.toUpperCase()}
    </h2>
  );

  const navItem = (icon, text, link) => (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `group relative flex items-center border-l-3 p-1 pl-2 transition-all ${
          isActive
            ? "border-green-500 bg-gray-100 text-gray-700"
            : "border-transparent hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <h3
        className={`overflow-hidden transition-all ${open ? "grow-1 pl-2" : "w-0"}`}
      >
        {text}
      </h3>
      {!open && (
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
      className={`flex h-[var(--height-with-nav)] flex-col border-r-1 border-gray-200 text-gray-700 transition-all ${open ? "w-[var(--sidebar-width)]" : "w-15"}`}
      // open ? "w-[var(--sidebar-width)]" : "w-56"
    >
      <div
        className={`mb-4 flex items-center justify-between border-b-1 border-gray-300 p-3 text-gray-800`}
        // open ? "justify-between" : "items-start justify-center"
        // style={!open ? { minHeight: "100%" } : {}}
      >
        {/* {open && ( */}
        <button
          className={`overflow-hidden text-left text-nowrap transition-all ${open ? "grow-1" : "w-0"}`}
        >
          <span className="mr-2 bg-gray-300 px-2"></span>
          <h2 className="inline font-semibold">{currentWorkspace}</h2>
        </button>
        {/* )} */}
        <button
          // className={` ${open ? "" : "w-full"}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          <MenuIcon
            className={`text-2xl text-gray-500 ${open ? "rotate-0" : "rotate-180"} transition-transform`}
          />
        </button>
      </div>
      <div className={`flex flex-col gap-4 px-3`}>
        {/* ${open ? "" : "hidden"} */}
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
