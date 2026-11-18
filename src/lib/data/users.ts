import { store } from "@/lib/mock/store";
import type { User, UserWithStats } from "@/lib/types";

function withStats(user: User): UserWithStats {
  const wallet = store.wallets.find((w) => w.user_id === user.id);
  return {
    ...user,
    wallet_balance_kobo: wallet?.balance_kobo ?? 0,
    escrows_as_client: store.escrows.filter((e) => e.client_id === user.id).length,
    escrows_as_freelancer: store.escrows.filter((e) => e.freelancer_id === user.id).length,
  };
}

export async function listUsers(query?: string): Promise<UserWithStats[]> {
  const q = query?.trim().toLowerCase();
  const matches = q
    ? store.users.filter(
        (u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    : store.users;
  return matches.filter((u) => u.role === "user").map(withStats);
}

export async function getUser(id: string): Promise<UserWithStats | undefined> {
  const user = store.users.find((u) => u.id === id);
  return user ? withStats(user) : undefined;
}

export function userLabel(id: string): Pick<User, "id" | "full_name" | "email"> {
  const user = store.users.find((u) => u.id === id);
  return user
    ? { id: user.id, full_name: user.full_name, email: user.email }
    : { id, full_name: "Unknown user", email: "" };
}
