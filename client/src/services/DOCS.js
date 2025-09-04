/**
 * ===========================
 * Frontend API Reference
 * ===========================
 *
 * This file summarizes all API endpoints used in the frontend,
 * including parameters, return values, and purpose.
 *
 */

/**
 * Auth APIs
 */
export const AuthAPI = {
    login: {
        description: "Log in a user with email and password",
        endpoint: "/auth/login",
        method: "POST",
        params: {
            email: "string - user's email",
            password: "string - user's password",
        },
        returns:
            "Promise<Object> - authentication response (tokens, user info)",
    },
    register: {
        description: "Register a new user",
        endpoint: "/auth/register",
        method: "POST",
        params: {
            name: "string - full name",
            email: "string - email",
            password: "string - password",
        },
        returns: "Promise<Object> - created user object",
    },
    logout: {
        description: "Log out current user",
        endpoint: "/auth/logout",
        method: "GET",
        params: {},
        returns: "Promise<Object> - server response",
    },
    refreshToken: {
        description: "Refresh authentication token",
        endpoint: "/auth/refresh",
        method: "POST",
        params: {},
        returns: "Promise<Object> - new auth token",
    },
};

/**
 * User APIs
 */
export const UserAPI = {
    getUser: {
        description: "Get currently authenticated user info",
        endpoint: "/user/me",
        method: "GET",
        params: {},
        returns: "Promise<Object> - user object",
    },
    updateUser: {
        description: "Update current user's info",
        endpoint: "/user/me",
        method: "PATCH",
        params: {
            name: "string (optional) - new name",
            email: "string (optional) - new email",
            password: "string (optional) - new password",
        },
        returns: "Promise<Object> - updated user object",
    },
};

/**
 * Inventory APIs
 */
export const InventoryAPI = {
    getBrands: {
        description: "Get all brands in a division (list)",
        endpoint:
            "/workspace/{workspaceId}/divisions/{divisionId}/inventory/all-brands",
        method: "GET",
        params: {
            workspaceId: "string",
            divisionId: "string",
        },
        returns: "Promise<Object[]> - array of brand objects",
    },
    getDetailedBrands: {
        description: "Get all brands in a division (detailed)",
        endpoint:
            "/workspace/{workspaceId}/divisions/{divisionId}/inventory/all-brands/d",
        method: "GET",
        params: {
            workspaceId: "string",
            divisionId: "string",
        },
        returns: "Promise<Object[]> - array of detailed brand objects",
    },
    saveSelectedBrands: {
        description: "Select/save brands in a division",
        endpoint:
            "/workspace/{workspaceId}/divisions/{divisionId}/inventory/brands",
        method: "PATCH",
        params: {
            workspaceId: "string",
            divisionId: "string",
            brands: "Array<Object> - selected brands",
        },
        returns: "Promise<Object> - server response",
    },
};
