import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isTokenValid } from "@/helpers/utils";

import { AUTH_PAGES } from "@/constants/app-defaults";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;

  const isRefreshValid = refreshToken && isTokenValid(refreshToken);

  if (AUTH_PAGES.includes(request.nextUrl.pathname)) {
    if (refreshToken && isRefreshValid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!refreshToken || !isRefreshValid) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (accessToken || refreshToken) {
      response.cookies.delete("access");
      response.cookies.delete("refresh");
    }
    return response;
  }
  return NextResponse.next();

}

export const config = {
  matcher: [
    "/",
    "/applied-posts",
    "/profile",
    "/my-posts",
    "/login",
    "/sign-up",
  ],
};
