import { NavLink } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <NavLink
      to="/dashboard"
      viewTransition
      className={[
        "py-0 text-2xl font-bold text-gray-700 no-underline",
        className,
      ].join(" ")}
    >
      Starter
    </NavLink>
  );
}
