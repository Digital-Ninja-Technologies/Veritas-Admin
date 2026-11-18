import { cookies } from "next/headers";

/**
 * Mock session handling — a single admin account, no real backend yet.
 * Shaped so swapping in the real `POST /api/v1/auth/login` (which returns a
 * JWT `access_token` + opaque `refresh_token`, see veritas-backend's
 * README) later just means storing that token here instead of a flag.
 */
const SESSION_COOKIE = "veritas_admin_session";

export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "usr-admin", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  return value ? { userId: value } : null;
}
