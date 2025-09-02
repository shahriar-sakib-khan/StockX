import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";

export default function App() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return <RouterProvider router={router} />;
}
