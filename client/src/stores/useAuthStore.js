// @ts-check
import { create } from "zustand";
import {
    getUser,
    refreshToken,
} from "../features/authentication/services/authServices";

/** @typedef {import("@/types/auth").User} User */

/**
 * @typedef {Object} AuthStore
 * @property {User | null} user
 * @property {string | null} accessToken
 * @property {boolean} initializing
 * @property {() => Promise<void>} initializeAuth
 * @property {() => void} clearUser
 */

export const useAuthStore = create(
    /** @type {import('zustand').StoreApi<AuthStore>} */ (set) => ({
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
                    set({ user: userData.user });
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
    }),
);
