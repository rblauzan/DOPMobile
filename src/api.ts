import axios from "axios";
import { USER_STORAGE_KEY } from "./constants";

export const api = axios.create({
  baseURL: import.meta.env.API_URL || '',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(USER_STORAGE_KEY)
    if(token) {
      config.headers.Authorization = `${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

