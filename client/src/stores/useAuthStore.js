import { create } from "zustand";
import {
  getUser,
  login as loginService,
  logout as logoutService,
  refreshToken,
} from "../features/authentication/services/authServices";
import API from "../services/apiClient";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  initializating: true,

  login: async (credentials) => {
    const data = await loginService(credentials);

    if (data.accessToken) {
      set({ accessToken: data.accessToken });
      API.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
    }
    const userData = data.user ?? (await getUser());
    set({ user: userData });

    return data;
  },

  logout: async () => {
    await logoutService();
    set({ accessToken: null, user: null });
    API.defaults.headers.Authorization = null;
  },

  initializeAuth: async () => {
    set({ initializating: true });
    try {
      const data = await refreshToken();
      if (data.accessToken) {
        set({ accessToken: data.accessToken });
        API.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        const userData = await getUser();
        set({ user: userData });
      } else {
        set({ accessToken: null, user: null });
      }
    } catch {
      set({ accessToken: null, user: null });
    } finally {
      set({ initializating: false });
    }
  },
}));
