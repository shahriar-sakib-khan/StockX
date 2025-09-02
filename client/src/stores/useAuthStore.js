import { create } from "zustand";
import {
    getUser,
    refreshToken,
} from "../features/authentication/services/authServices";

export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    initializing: true,

    // refresh token and fetch user
    initializeAuth: async () => {
        set({ initializing: true });
        try {
            const data = await refreshToken();
            if (data.accessToken) {
                set({ accessToken: data.accessToken });
                const userData = await getUser();
                set({ user: userData });
            } else {
                set({ accessToken: null, user: null });
            }
        } catch {
            set({ accessToken: null, user: null });
        } finally {
            set({ initializing: false });
        }
    },

    clearUser: () => set({ user: null, accessToken: null }),
}));
