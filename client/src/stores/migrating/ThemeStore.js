 import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: typeof window != "undefined" && localStorage.getItem("theme") === "dark" ? "dark" : "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
  toggleTheme: (theme) => {
    const next = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    set({ theme: next });
  }
}));

export default useThemeStore;