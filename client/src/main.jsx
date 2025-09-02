import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./services/queryClient.js";
import App from "./App.jsx";
import "./assets/global.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>,
);
