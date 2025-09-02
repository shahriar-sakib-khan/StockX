import { NavLink } from "react-router-dom";

export default function Logo({ className = "" }) {
    return (
        <NavLink to="/dashboard" viewTransition className={className}>
            StockX
        </NavLink>
    );
}
