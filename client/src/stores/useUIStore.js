import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
    persist(
        (set) => ({
            // States
            isUserMenuOpen: false,
            isSidebarOpen: true,
            isStoreMenuOpen: false,

            // Generic setter
            setMenuState: (menukey, isOpen) => set({ [menukey]: isOpen }),

            // Generic toggle
            toggleMenu: (menukey) =>
                set((state) => ({ [menukey]: !state[menukey] })),

            // Close all menus at once
            closeAll: () => {
                set({
                    isUserMenuOpen: false,
                    isStoreMenuOpen: false,
                });
            },
        }),
        {
            name: "menu-storage", // localstorage key
            partialize: (state) => ({ isSidebarOpen: state.isSidebarOpen }),
        },
    ),
);
