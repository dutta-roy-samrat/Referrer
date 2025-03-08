import axios from "axios";

import { getAuthCookieHeader } from "@/helpers/server-cookie";

import { API_URL } from "@/constants/environment-variables";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  withCredentials: true,
});

export const axiosServerInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
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
