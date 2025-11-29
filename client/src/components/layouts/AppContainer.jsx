import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Titlebar from "./Titlebar";
import MobileBottomNav from "./MobileBottomNav"; // Import Bottom Nav
import { useAuthStore } from "../../stores/useAuthStore";
import LoadingComponent from "../ui/LoadingComponent";
import { redirectToLogin } from "../../utils/redirectToLogin";

export default function AppContainer({ children }) {
    const user = useAuthStore((state) => state.user);
    const initializing = useAuthStore((state) => state.initializing);

    if (initializing) return <LoadingComponent />;

    if (!user) {
        redirectToLogin(window.location.pathname);
        return null;
    }

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50">
            {/* Top Navigation */}
            <Navbar userMenu />

            {/* Main Layout Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (Hidden on Mobile) */}
                <Sidebar />

                {/* Content Area */}
                <main className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden pb-[var(--navbar-height)] lg:pb-0">
                    <Titlebar />
                    <div className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation (Visible only on Mobile) */}
            <MobileBottomNav />
        </div>
    );
}
