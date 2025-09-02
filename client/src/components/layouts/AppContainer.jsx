import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Titlebar from "./Titlebar";
import { useAuthStore } from "../../stores/useAuthStore";
import LoadingComponent from "../ui/LoadingComponent";
import { redirectToLogin } from "../../utils/redirectToLogin";

export default function AppContainer({ children }) {
    // let Data = { name: "Visitor" };
    // const isLoading = true;

    const user = useAuthStore((state) => state.user);
    const initializing = useAuthStore((state) => state.initializing);

    if (initializing) return <LoadingComponent />;

    if (!user) return redirectToLogin(window.location.pathname);

    return (
        <div className="grid h-full w-full">
            <Navbar dark userMenu />
            <div className="grid grid-cols-[auto_1fr]">
                <Sidebar />
                <div className="grid grid-rows-[1fr_auto]">
                    <Titlebar />
                    {children}
                </div>
            </div>
        </div>
    );
}
