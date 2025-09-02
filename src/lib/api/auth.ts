/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./axios";

const BASE = (import.meta as any)?.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";
const url = (p: string) => `${BASE}${p}`;

export type LoginResult = {
  accessToken: string;
};

function extractAccessToken(data: any): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;
  return data.accessToken || data.token || null;
}

/**
 * Calls /auth/login with { username, password } and returns { accessToken }.
 * Throws on error; caller decides how to fallback.
 */
export async function loginApi(username: string, password: string): Promise<LoginResult> {
  try {
    const { data } = await api.post(url("/auth/login"), { username, password });
    const accessToken = extractAccessToken(data);
    if (!accessToken) throw new Error("Invalid login response");
    return { accessToken };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Unable to login. Please try again.";
    throw new Error(msg);
  }
}
