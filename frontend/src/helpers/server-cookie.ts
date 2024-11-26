"use server";

import { cookies } from "next/headers";

export const getAuthCookieHeader = async() => {
  const cookieStore = await cookies();
  const accessCookieValue = cookieStore.get("access")?.value;
  const refreshCookieValue = cookieStore.get("refresh")?.value;

  const accessCookie = accessCookieValue ? `access=${accessCookieValue};` : "";
  const refreshCookie = refreshCookieValue ? `refresh=${refreshCookieValue};` : "";

  return `${accessCookie}${refreshCookie}`;
};
