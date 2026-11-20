"use server";

import { revalidatePath } from "next/cache";
import { markContactMessageRead, updateVeripalApplicationStatus } from "@/lib/data/leads";
import type { VeripalApplicationStatus } from "@/lib/types";

export async function markContactMessageReadAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const result = await markContactMessageRead(id);
  if (result.ok) revalidatePath("/leads");
  return result;
}

export async function updateVeripalApplicationStatusAction(
  id: string,
  status: VeripalApplicationStatus,
): Promise<{ ok: boolean; error?: string }> {
  const result = await updateVeripalApplicationStatus(id, status);
  if (result.ok) {
    revalidatePath("/leads");
    revalidatePath(`/leads/veripals/${id}`);
  }
  return result;
}
