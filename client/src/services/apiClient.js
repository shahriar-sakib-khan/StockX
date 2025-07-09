import axios from "axios";

// url from env variables
const API_URL = import.meta.env.VITE_API_URL;

// axios instance options
const options = {
  baseURL: API_URL,
  withCredentials: true,
};

// axios api instance
const API = axios.create(options);

// export the api instance
export default API;
