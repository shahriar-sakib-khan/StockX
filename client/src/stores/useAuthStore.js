import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    getUser,
    refreshToken,
    getAllStores,
} from "../features/authentication/services/authServices";

/** @typedef {import("@/types/auth").User} User */

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            initializing: true,

            // --- Store selection ---
            currentStore: null, // the store the user selects
            allStores: [], // list of all stores fetched after login

            // -----------------------
            // Initialize Auth
            // -----------------------
            initializeAuth: async () => {
                set({ initializing: true });
                try {
                    const tokenRes = await refreshToken();
                    if (tokenRes.accessToken) {
                        set({ accessToken: tokenRes.accessToken });

                        const userData = await getUser();
                        set({ user: userData });

                        // fetch all stores for the user
                        const storesRes = await getAllStores();
                        set({ allStores: storesRes?.stores || [] });

                        return {
                            user: userData,
                            stores: storesRes?.stores || [],
                        };
                    } else {
                        set({
                            accessToken: null,
                            user: null,
                            currentStore: null,
                            allStores: [],
                        });
                        return { user: null, stores: [] };
                    }
                } catch {
                    set({
                        accessToken: null,
                        user: null,
                        currentStore: null,
                        allStores: [],
                    });
                    return { user: null, stores: [] };
                } finally {
                    set({ initializing: false });
                }
            },

            // -----------------------
            // Store methods
            // -----------------------
            setCurrentStore: (store) => set({ currentStore: store }),
            setAllStores: (stores) => set({ allStores: stores }),

            // -----------------------
            // Clear everything
            // -----------------------
            clearUser: () =>
                set({
                    user: null,
                    accessToken: null,
                    currentStore: null,
                    allStores: [],
                }),
        }),
        {
            name: import.meta.env.VITE_AUTH_STORAGE_KEY || "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                currentStore: state.currentStore,
                allStores: state.allStores,
            }),
        },
    ),
);
