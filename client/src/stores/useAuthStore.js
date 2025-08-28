import { create } from "zustand";
import {
  getUser,
  refreshToken,
} from "../features/authentication/services/authServices";

export const useAuthStore = create((set) => ({
  user: null,
  initializating: true,

  // refresh token and fetch user
  initializeAuth: async () => {
    set({ initializing: true });
    try {
      const data = await refreshToken();
      if (data.accessToken) {
        const userData = await getUser();
        set({ user: userData });
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    } finally {
      set({ initializing: false });
    }
  },

  clearUser: () => set({ user: null }),
}));
