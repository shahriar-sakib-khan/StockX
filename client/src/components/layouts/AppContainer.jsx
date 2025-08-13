import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Titlebar from "./titlebar";
import { useAuthStore } from "../../stores/useAuthStore";

export default function AppContainer({ children }) {
  const user = useAuthStore((state) => state.user);
  const initializing = useAuthStore((state) => state.initializing);
  // let Data = { name: "Visitor" };
  // const isLoading = false;
  // Data = data;

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center text-3xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectUrl: window.location.pathname }}
      />
    );
  }

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
