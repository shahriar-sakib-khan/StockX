import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL environment variable is not set.");
}

const options = {
  baseURL: API_URL,
  withCredentials: true,
};

const API = axios.create(options);

// Interceptor to return only response data and normalize error objects
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
