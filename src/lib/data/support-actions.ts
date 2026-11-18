"use server";

import { revalidatePath } from "next/cache";
import { replyToTicket, updateTicketStatus } from "@/lib/data/support";
import type { SupportTicketStatus } from "@/lib/types";

export async function replyToTicketAction(
  ticketId: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const result = await replyToTicket(ticketId, body);
  if (result.ok) {
    revalidatePath("/support");
    revalidatePath(`/support/${ticketId}`);
    return { ok: true };
  }
  return { ok: false, error: result.error };
}

export async function updateTicketStatusAction(
  ticketId: string,
  status: SupportTicketStatus,
): Promise<{ ok: boolean; error?: string }> {
  const result = await updateTicketStatus(ticketId, status);
  if (result.ok) {
    revalidatePath("/support");
    revalidatePath(`/support/${ticketId}`);
    return { ok: true };
  }
  return { ok: false, error: result.error };
}
