import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const heading = (headingText) => {
    return (
      <h2 className="mb-2 text-sm font-semibold">
        {headingText.toUpperCase()}
      </h2>
    );
  };

  const navItem = (navText, link) => {
    return (
      <NavLink
        to={link}
        className={({ isActive }) =>
          `rounded-lg p-1 transition-all duration-100 ${isActive ? "bg-gray-700 px-2 text-gray-300" : "hover:bg-gray-800 hover:text-gray-300"}`
        }
      >
        {navText}
      </NavLink>
    );
  };

  return (
    <aside className="flex h-[100dvh] w-[var(--sidebar-width)] flex-col bg-gray-900 p-3 text-gray-400">
      <div className="mb-4 flex items-center gap-2 text-gray-300">
        <h1 className="mb text-xl font-semibold">Starter</h1>
        <button className="ml-auto">O</button>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <nav aria-label="General" className="border-b-1 border-gray-600 pb-2">
          {heading("GENERAL")}
          <div className="flex flex-col gap-1">
            {navItem("Home", "/")}
            {navItem("Dashboard", "/dashboard")}
            {navItem("About", "/about")}
          </div>
        </nav>
        <nav
          aria-label="My Account"
          className="border-b-1 border-gray-600 pb-2"
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
