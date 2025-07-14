import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function AppContainer() {
  const { user, isLoading } = useAuth();

  return isLoading ? (
    <div className="flex h-full items-center justify-center text-3xl font-semibold text-gray-700">
      Loading...
    </div>
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ redirectUrl: window.location.pathname }}
    />
  );
}
