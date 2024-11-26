import { getAuthCookieHeader } from "@/helpers/server-cookie";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000,
  withCredentials: true,
});

export const axiosServerInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000,
});

axiosServerInstance.interceptors.request.use(
  async(config) => {
    const authCookieHeader = await getAuthCookieHeader();
    if (authCookieHeader) {
      config.headers["Cookie"] = authCookieHeader;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
