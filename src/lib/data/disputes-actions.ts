"use server";

import { revalidatePath } from "next/cache";
import { resolveDispute } from "@/lib/data/disputes";
import type { DisputeResolution } from "@/lib/types";

export async function resolveDisputeAction(
  disputeId: string,
  resolution: DisputeResolution,
  adminNote: string,
): Promise<{ ok: boolean; error?: string }> {
  const result = await resolveDispute(disputeId, resolution, adminNote);
  if (result.ok) {
    revalidatePath("/disputes");
    revalidatePath(`/disputes/${disputeId}`);
    revalidatePath("/escrows");
    revalidatePath("/users");
    revalidatePath("/");
    return { ok: true };
  }
  return { ok: false, error: result.error };
}
