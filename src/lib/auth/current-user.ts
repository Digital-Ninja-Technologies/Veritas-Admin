import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/mock/store";
import type { User } from "@/lib/types";

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  return store.users.find((u) => u.id === session.userId) ?? null;
}
