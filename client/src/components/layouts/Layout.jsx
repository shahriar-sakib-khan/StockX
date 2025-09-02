import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <Outlet />
        </div>
    );
}
