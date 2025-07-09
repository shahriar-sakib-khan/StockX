import API from "../services/apiClient";

export const login = async ({ email, password }) => {
  API.post("/auth/login", { email, password });
};
