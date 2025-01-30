import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { axiosServerInstance } from "@/services/axios";

import { AUTH_PAGES } from "@/constants/app-defaults";

export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh");
  // redirection logic for auth pages
  if (AUTH_PAGES.includes(request.nextUrl.pathname)) {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // redirection logic for auth protected pages
  try {
    if (!refreshToken) {
      throw "No Refresh Token present in cookie header";
    }
    await axiosServerInstance.get("auth/authorization-check");
    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
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
