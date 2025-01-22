import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { axiosServerInstance } from "./services/axios";

export async function middleware(request: NextRequest) {
  console.log(request.nextUrl.pathname);
  try {
    const refreshToken = request.cookies.get("refresh");
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
  matcher: ["/", "/applied-posts", "/profile", "/my-posts"],
};
