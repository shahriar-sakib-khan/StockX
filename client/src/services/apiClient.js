import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore-deprecated";

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
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to return only response data and normalize error objects
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      return Promise.reject({ status, ...data });
    } else {
      // Network error or no response received
      return Promise.reject({ status: null, message: error.message });
    }
  },
);

export default API;
