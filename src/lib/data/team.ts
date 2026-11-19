import { store } from "@/lib/mock/store";
import type { TeamInvite, User } from "@/lib/types";

function randomToken(): string {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 36).toString(36)).join("");
}

export async function listStaff(): Promise<User[]> {
  return store.users
    .filter((u) => u.role === "admin" || u.role === "customer_care")
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
}

export async function listInvites(status?: "pending" | "all"): Promise<TeamInvite[]> {
  const matches =
    !status || status === "all" ? store.teamInvites : store.teamInvites.filter((i) => i.status === status);
  return [...matches].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createInvite(
  email: string,
  invitedBy: string,
): Promise<{ ok: true; token: string } | { ok: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return { ok: false, error: "Email is required" };
  if (store.users.some((u) => u.email.toLowerCase() === normalized)) {
    return { ok: false, error: "A user with this email already exists" };
  }
  if (store.teamInvites.some((i) => i.email.toLowerCase() === normalized && i.status === "pending")) {
    return { ok: false, error: "There's already a pending invite for this email" };
  }

  const token = randomToken();
  store.teamInvites.unshift({
    id: `inv-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    email: normalized,
    token,
    status: "pending",
    invited_by: invitedBy,
    created_at: new Date().toISOString(),
  });

  return { ok: true, token };
}

export async function revokeInvite(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const invite = store.teamInvites.find((i) => i.id === id);
  if (!invite) return { ok: false, error: "Invite not found" };
  if (invite.status !== "pending") return { ok: false, error: "Only pending invites can be revoked" };

  invite.status = "revoked";
  return { ok: true };
}

export async function getInviteByToken(token: string): Promise<TeamInvite | undefined> {
  return store.teamInvites.find((i) => i.token === token && i.status === "pending");
}

export interface AcceptInviteInput {
  full_name: string;
  phone: string;
  password: string;
  avatar_seed: string;
}

export async function acceptInvite(
  token: string,
  input: AcceptInviteInput,
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const invite = store.teamInvites.find((i) => i.token === token && i.status === "pending");
  if (!invite) return { ok: false, error: "This invite is no longer valid" };
  if (!input.full_name.trim()) return { ok: false, error: "Full name is required" };
  if (input.password.length < 8) return { ok: false, error: "Password must be at least 8 characters" };
  if (!input.avatar_seed) return { ok: false, error: "Pick an avatar to continue" };

  const id = `usr-cc-${Date.now()}`;
  store.users.push({
    id,
    email: invite.email,
    full_name: input.full_name.trim(),
    role: "customer_care",
    phone: input.phone.trim(),
    created_at: new Date().toISOString(),
    avatar_seed: input.avatar_seed,
    is_active: true,
  });
  store.staffCredentials.push({ user_id: id, password: input.password });

  invite.status = "accepted";
  invite.accepted_at = new Date().toISOString();

  return { ok: true, userId: id };
}

export async function setStaffActive(
  id: string,
  isActive: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = store.users.find((u) => u.id === id);
  if (!user) return { ok: false, error: "Staff member not found" };
  if (user.role === "admin") return { ok: false, error: "Super admins can't be suspended" };

  user.is_active = isActive;
  return { ok: true };
}
