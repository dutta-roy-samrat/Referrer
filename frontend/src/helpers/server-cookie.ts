"use server";

import { cookies } from "next/headers";
import { AxiosResponse } from "axios";

import { axiosServerInstance } from "@/services/axios";

import { isTokenValid } from "@/helpers/utils";

export const serverCookieSetter = (response: AxiosResponse): AxiosResponse => {
  const accessToken = response.headers["x-access-token"];
  const refreshToken = response.headers["x-refresh-token"];

  const isMiddlewareRequest =
    !response.config.headers["User-Agent"] &&
    !response.config.headers["Referer"];

  if (!isMiddlewareRequest) {
    if (accessToken) {
      cookies().set("access", accessToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    if (refreshToken) {
      cookies().set("refresh", refreshToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
  }

  return response;
};

export const getAuthCookieHeader = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access")?.value;
  const refreshToken = cookieStore.get("refresh")?.value;

  if (accessToken && isTokenValid(accessToken)) {
    return { Authorization: `Bearer ${accessToken}` };
  }

  if (refreshToken && isTokenValid(refreshToken)) {
    return { refresh: refreshToken };
  }

  if (accessToken || refreshToken) {
    cookies().delete("access");
    cookies().delete("refresh");
  }
  return {};
};

interface ServerCookieDeleterError extends Error {
  response?: {
    status: number;
  };
  config: {
    headers: {
      [key: string]: string;
    };
  };
}

export const serverCookieDeleter = async (
  error: ServerCookieDeleterError,
): Promise<any> => {
  if (error.response?.status === 401) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh")?.value;

    if (refreshToken) {
      try {
        const response: AxiosResponse = await axiosServerInstance.post(
          "auth/authorization-check/",
          {
            refresh: refreshToken,
          },
        );

        const newAccessToken = response.headers["x-access-token"];
        if (newAccessToken) {
          const originalRequest = error.config;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosServerInstance(originalRequest);
        }
      } catch {
        cookies().delete("access");
        cookies().delete("refresh");
      }
    }
  }
  return Promise.reject(error);
};
