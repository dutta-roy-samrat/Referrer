export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(name + "="));
  if (!cookie) return null;
  return cookie.split("=")[1].trim();
};

export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; Secure; SameSite=Strict`;
};