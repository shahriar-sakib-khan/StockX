import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const heading = (headingText) => (
    <h2 className="mb-2 text-sm font-semibold">{headingText.toUpperCase()}</h2>
  );

  const navItem = (navText, link) => (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `border-l-3 p-1 transition-all duration-100 ${
          isActive
            ? "border-green-500 bg-gray-100 pl-2 text-gray-700"
            : "border-transparent hover:bg-gray-100"
        }`
      }
    >
      {navText}
    </NavLink>
  );

  return (
    <aside
      className={`flex h-[var(--height-with-nav)] ${
        open ? "w-[var(--sidebar-width)]" : "w-12"
      } flex-col overflow-hidden border-r-1 border-gray-200 p-3 text-gray-700 transition-all duration-200`}
    >
      <div
        className={`flex items-center ${
          open ? "justify-end" : "items-start justify-center"
        } text-gray-800`}
        style={!open ? { minHeight: "100%" } : {}}
      >
        <button
          className={`cursor-pointer font-bold transition-transform duration-200 ${
            open ? "" : "w-full"
          }`}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          <span
            className={`inline-block transition-transform duration-200 ${
              open ? "rotate-0" : "rotate-180"
            }`}
            style={{ display: "inline-block" }}
          >
            &lt;
          </span>
        </button>
      </div>
      <div className={`flex flex-col gap-4 ${open ? "" : "hidden"}`}>
        <nav aria-label="General" className="border-b-1 border-gray-300 pb-2">
          {heading("GENERAL")}
          <div className="flex flex-col gap-1">
            {navItem("Home", "/")}
            {navItem("Dashboard", "/dashboard")}
            {navItem("About", "/about")}
          </div>
        </nav>
        <nav
          aria-label="My Account"
          className="border-b-1 border-gray-300 pb-2"
        >
          {heading("MY ACCOUNT")}
          <div className="flex flex-col gap-1">
            {navItem("Profile", "/profile")}
            {navItem("Settings", "/settings")}
          </div>
        </nav>
        <nav aria-label="Admin Panel">
          {heading("ADMIN PANEL")}
          <div className="flex flex-col gap-1">
            {navItem("Users", "/users")}
            {navItem("Statistics", "/statistics")}
          </div>
        </nav>
      </div>
    </aside>
  );
}
