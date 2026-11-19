import { cookies } from "next/headers";
import type { UserRole } from "@/lib/types";

/**
 * Mock session handling — no real backend yet. Shaped so swapping in the
 * real `POST /api/v1/auth/login` (which returns a JWT `access_token` +
 * opaque `refresh_token`, see veritas-backend's README) later just means
 * storing that token here instead of a flag.
 *
 * The cookie carries `role` alongside `userId` (not just a flag) so that
 * `proxy.ts` can enforce customer-care's restricted routes without needing
 * the mock data store — middleware runs in a separate runtime from the
 * server components that own the in-memory store, so it can't read it.
 */
const SESSION_COOKIE = "veritas_admin_session";

interface SessionData {
  userId: string;
  role: UserRole;
}

export async function createSession(userId: string, role: UserRole) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify({ userId, role } satisfies SessionData), {
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

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  try {
    return JSON.parse(value) as SessionData;
  } catch {
    return null;
  }
}
