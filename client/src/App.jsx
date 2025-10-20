import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";

export default function App() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <>
            {/* The main router */}
            <RouterProvider router={router} />

            {/* Global toaster must be inside React tree */}
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand
                duration={3000}
            />
        </>
    );
}
