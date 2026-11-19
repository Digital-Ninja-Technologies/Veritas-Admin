"use server";

import { revalidatePath } from "next/cache";
import { createInvite, revokeInvite, setStaffActive } from "@/lib/data/team";
import { getSession } from "@/lib/auth/session";

export async function createInviteAction(
  email: string,
): Promise<{ ok: boolean; error?: string; token?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in" };

  const result = await createInvite(email, session.userId);
  if (result.ok) {
    revalidatePath("/team");
    return { ok: true, token: result.token };
  }
  return { ok: false, error: result.error };
}

export async function revokeInviteAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const result = await revokeInvite(id);
  if (result.ok) revalidatePath("/team");
  return result;
}

export async function setStaffActiveAction(
  id: string,
  isActive: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const result = await setStaffActive(id, isActive);
  if (result.ok) revalidatePath("/team");
  return result;
}
