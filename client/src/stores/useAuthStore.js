import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    getUser,
    refreshToken,
    getMyWorkspaces,
    getWorkspaceDivisions,
} from "../features/authentication/services/authServices";

/** @typedef {import("@/types/auth").User} User */

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            initializing: true,
            currentWorkspace: null,
            currentDivision: null,
            currentDivisions: [],

            // Refresh token + fetch user
            initializeAuth: async () => {
                set({ initializing: true });
                try {
                    const data = await refreshToken();
                    if (data.accessToken) {
                        set({ accessToken: data.accessToken });

                        const userData = await getUser();
                        set({ user: userData });

                        const workspacesRes = await getMyWorkspaces();
                        return {
                            user: userData,
                            workspaces: workspacesRes?.workspaces || [],
                        };
                    } else {
                        set({
                            accessToken: null,
                            user: null,
                            currentWorkspace: null,
                            currentDivision: null,
                            currentDivisions: [],
                        });
                        return { user: null, workspaces: [] };
                    }
                } catch {
                    set({
                        accessToken: null,
                        user: null,
                        currentWorkspace: null,
                        currentDivision: null,
                        currentDivisions: [],
                    });
                    return { user: null, workspaces: [] };
                } finally {
                    set({ initializing: false });
                }
            },

            // -----------------
            // Workspace methods
            // -----------------
            setWorkspace: async (workspace) => {
                if (!workspace?.id) {
                    set({
                        currentWorkspace: null,
                        currentDivision: null,
                        currentDivisions: [],
                    });
                    return;
                }

                set({
                    currentWorkspace: workspace,
                    currentDivision: null,
                    currentDivisions: [],
                });

                try {
                    // 🔥 fetch divisions from backend
                    const divisionsRes = await getWorkspaceDivisions(
                        workspace.id,
                    );
                    set({ currentDivisions: divisionsRes?.divisions || [] });
                } catch (err) {
                    console.error(
                        "❌ Failed to fetch divisions for workspace:",
                        err,
                    );
                    set({ currentDivisions: [] });
                }
            },

            // -----------------
            // Division methods
            // -----------------
            setDivision: (division) => set({ currentDivision: division }),
            setDivisions: (divisions) => set({ currentDivisions: divisions }),

            addDivision: async (division) => {
                const { currentWorkspace } = get();
                if (!currentWorkspace?.id) return;

                // after adding, fetch updated list from backend
                try {
                    const divisionsRes = await getWorkspaceDivisions(
                        currentWorkspace.id,
                    );
                    set({
                        currentDivisions: divisionsRes?.divisions || [],
                        currentDivision: division,
                    });
                } catch (err) {
                    console.error(
                        "❌ Failed to refresh divisions after adding:",
                        err,
                    );
                    // fallback: just append locally
                    set((state) => ({
                        currentDivisions: [
                            ...(state.currentDivisions || []),
                            division,
                        ],
                        currentDivision: division,
                    }));
                }
            },

            // -----------------
            // Clear all auth data
            // -----------------
            clearUser: () =>
                set({
                    user: null,
                    accessToken: null,
                    currentWorkspace: null,
                    currentDivision: null,
                    currentDivisions: [],
                }),
        }),
        {
            name: import.meta.env.VITE_AUTH_STORAGE_KEY || "auth-storage",
            partialize: (state) => ({
                user: state.user,
                currentWorkspace: state.currentWorkspace,
                currentDivision: state.currentDivision,
                currentDivisions: state.currentDivisions,
            }),
        },
    ),
);
