import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

export const api = axios.create({
  baseURL: import.meta.env.API_URL || 'https://idp-bcc.sib.cu/IDP/',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if(token) {
      config.headers.Authorization = `${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

