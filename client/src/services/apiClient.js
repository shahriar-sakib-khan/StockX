import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL)
    throw new Error("❌ VITE_API_URL environment variable is not set.");

const API = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Request interceptor for sending access token
API.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    console.log("🔑 Sending token:", token);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor to return only response data and normalize error objects
API.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            const { status, data } = error.response || {};
            return Promise.reject({
                status,
                message: data.message || "Something went wrong",
                errors: data.errors || null,
            });
        } else {
            return Promise.reject({
                status: null,
                message: error.message || "Network error",
            });
        }
    },
);

export default API;
