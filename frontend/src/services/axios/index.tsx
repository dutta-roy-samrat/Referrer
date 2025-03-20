import axios from "axios";

import {
  getAuthCookieHeader,
  serverCookieDeleter,
  serverCookieSetter,
} from "@/helpers/server-cookie";
import { isTokenValid } from "@/helpers/utils";
import { getCookie, setCookie } from "@/helpers/cookie";

import { API_URL } from "@/constants/environment-variables";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  withCredentials: true,
});

export const axiosServerInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  withCredentials: true,
});

const resetCookies = () => {
  document.cookie = "access=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      if (config.url === "/auth/logout/") {
        resetCookies();
        return config;
      }
      const accessToken = getCookie("access");

      if (accessToken && isTokenValid(accessToken)) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      }
      const refreshToken = getCookie("refresh");

      if (refreshToken && isTokenValid(refreshToken)) {
        try {
          const response = await axiosInstance.post(
            "auth/authorization-check/",
            {
              refresh: refreshToken,
            },
          );

          const newAccessToken = response.headers["x-access-token"];
          if (newAccessToken) {
            setCookie("access", newAccessToken);
            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }
        } catch {
          resetCookies();
        }
        return config;
      }
      resetCookies();
      return config;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      const accessToken = response.headers["x-access-token"];
      const refreshToken = response.headers["x-refresh-token"];

      if (accessToken) {
        setCookie("access", accessToken);
      }
      if (refreshToken) {
        setCookie("refresh", refreshToken);
      }
    }
    return response;
  },
  (error) => Promise.reject(error),
);

axiosServerInstance.interceptors.request.use(
  async (config) => {
    const headers = await getAuthCookieHeader();
    Object.entries(headers).forEach(([key, value]) => {
      config.headers.set(key, value);
    });
    return config;
  },
  (error) => Promise.reject(error),
);

axiosServerInstance.interceptors.response.use(
  serverCookieSetter,
  serverCookieDeleter,
);
