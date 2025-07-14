import API from "../../../services/apiClient";

export const login = async (data) => API.post("/auth/login", data);
export const register = async (data) => API.post("/auth/register", data);
export const logout = async () => API.get("/auth/logout");
export const getUser = async () => API.get("/user/me");
