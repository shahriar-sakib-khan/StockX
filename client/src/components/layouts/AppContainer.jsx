import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppContainer({ children }) {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-3xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  if (!data) {
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
      <Navbar userMenu />
      <div className="grid grid-cols-[auto_1fr]">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
