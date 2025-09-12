// @ts-check
import API from "@/services/apiClient";

/** @typedef {import("@/types/auth").User} User */
/** @typedef {import("@/types/auth").LoginResponse} LoginResponse */
/** @typedef {import("@/types/auth").RegisterResponse} RegisterResponse */
/** @typedef {import("@/types/auth").LogoutResponse} LogoutResponse */
/** @typedef {import("@/types/auth").RefreshResponse} RefreshResponse */
/** @typedef {import("@/types/auth").GetUserResponse} GetUserResponse */
/** @typedef {import("@/types/auth").UpdateUserResponse} UpdateUserResponse */

/**
 * Log in a user.
 * @param {{ loginIdentifier: string, password: string }} data
 * @returns {Promise<LoginResponse>}
 */
export const login = async (data) => API.post("/auth/login", data);

/**
 * Register a new user.
 * @param {{ firstName: string, lastName: string, username: string, email: string, password: string, address?: string }} data
 * @returns {Promise<RegisterResponse>}
 */
export const register = async (data) => API.post("/auth/register", data);

/**
 * Log out the currently authenticated user.
 * @returns {Promise<LogoutResponse>}
 */
export const logout = async () => API.post("/auth/logout");

/**
 * Refresh the authentication token for the current user.
 * @returns {Promise<RefreshResponse>}
 */
export const refreshToken = async () => API.post("/auth/refresh");

/**
 * Get the currently authenticated user's information.
 * @returns {Promise<GetUserResponse>}
 */
export const getUser = async () => API.get("/user/me");

/**
 * Update the currently authenticated user's information.
 * @param {{ firstName?: string, lastName?: string, email?: string, username?: string, password?: string, address?: string }} data
 * @returns {Promise<UpdateUserResponse>}
 */
export const updateUser = async (data) => API.patch("/user/me", data);


export const CreateWorkspace = async (data) => API.post("/workspace", data);
export const getMyWorkspaces = async () => API.get("/workspace/mine");
export const CreateDivision = async (data, workspaceId) => {
    return API.post(`/workspace/${workspaceId}/divisions`, data)};
export const getWorkspaceDivisions = async (workspaceId) => {
    return API.get(`/workspace/${workspaceId}/divisions`)};




