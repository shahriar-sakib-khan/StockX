import React, { useEffect, useState } from "react";
import { FaStore, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Internal Services & Stores
import { getAllStores } from "../features/authentication/services/authServices";
import { useAuthStore } from "../stores/useAuthStore";

export default function ShowAllStores() {
    const [stores, setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const setCurrentStore = useAuthStore((state) => state.setCurrentStore);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStores = async () => {
            setIsLoading(true);
            try {
                const res = await getAllStores();
                setStores(res.data.stores || []);
            } catch (err) {
                console.error("Failed to fetch stores:", err);
                setError("Could not load your stores. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStores();
    }, []);

    const handleSelectStore = (store) => {
        setCurrentStore(store);
        navigate("/dashboard");
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 px-4 py-8 md:p-12">
            <div className="mb-8 text-center md:mb-12">
                <h1 className="text-2xl font-bold text-gray-800 md:text-4xl">
                    Select a Store
                </h1>
                <p className="mt-2 text-sm text-gray-500 md:text-base">
                    Manage your existing stores or create a new one
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 w-full max-w-lg rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                // GRID CONTAINER
                // Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols, Large: 4 cols
                <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {/* Render Existing Stores */}
                    {stores.map((store) => (
                        <div
                            key={store.id || store._id}
                            onClick={() => handleSelectStore(store)}
                            // Card Styling
                            className="group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:aspect-square"
                        >
                            {/* Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-500 transition-opacity group-hover:opacity-95"></div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center text-white">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl shadow-inner backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                    <FaStore />
                                </div>
                                <h3 className="max-w-[80%] break-words text-center text-xl font-bold tracking-tight">
                                    {store.name}
                                </h3>
                                <span className="mt-2 rounded-full bg-black/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90">
                                    {store.role || "Admin"}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* "Add Store" Card - Always appears at the end */}
                    <button
                        onClick={() => navigate("/addStore")}
                        className="group flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white text-gray-400 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-lg sm:aspect-square"
                        aria-label="Add new store"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-indigo-100">
                            <FaPlus className="text-2xl" />
                        </div>
                        <span className="mt-4 font-semibold">Create New Store</span>
                    </button>
                </div>
            )}
        </div>
    );
}
