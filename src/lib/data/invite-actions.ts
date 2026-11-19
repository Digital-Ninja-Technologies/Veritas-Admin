"use server";

import { acceptInvite, type AcceptInviteInput } from "@/lib/data/team";
import { createSession } from "@/lib/auth/session";

export async function acceptInviteAction(
  token: string,
  input: AcceptInviteInput,
): Promise<{ ok: boolean; error?: string }> {
  const result = await acceptInvite(token, input);
  if (!result.ok) return { ok: false, error: result.error };

  await createSession(result.userId, "customer_care");
  return { ok: true };
}
