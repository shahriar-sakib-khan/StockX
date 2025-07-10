import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const options = {
  baseURL: API_URL,
  withCredentials: true,
};

const API = axios.create(options);

// axios intercepter for only accessing relevant response data
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);

export default API;
