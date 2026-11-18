import { store } from "@/lib/mock/store";
import { userLabel } from "./users";
import type { SupportTicket, SupportTicketStatus, SupportTicketWithContext } from "@/lib/types";

function withContext(ticket: SupportTicket): SupportTicketWithContext {
  const messages = store.supportMessages
    .filter((m) => m.ticket_id === ticket.id)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return {
    ...ticket,
    user: userLabel(ticket.user_id),
    messages,
  };
}

export async function listSupportTickets(
  status?: SupportTicketStatus | "all",
): Promise<SupportTicketWithContext[]> {
  const matches =
    !status || status === "all"
      ? store.supportTickets
      : store.supportTickets.filter((t) => t.status === status);
  return [...matches]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .map(withContext);
}

export async function getSupportTicket(id: string): Promise<SupportTicketWithContext | undefined> {
  const ticket = store.supportTickets.find((t) => t.id === id);
  return ticket ? withContext(ticket) : undefined;
}

export async function replyToTicket(
  id: string,
  body: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const ticket = store.supportTickets.find((t) => t.id === id);
  if (!ticket) return { ok: false, error: "Ticket not found" };
  if (!body.trim()) return { ok: false, error: "Reply can't be empty" };

  store.supportMessages.push({
    id: `sms-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    ticket_id: id,
    sender_id: "usr-admin",
    sender_role: "admin",
    body: body.trim(),
    created_at: new Date().toISOString(),
  });
  if (ticket.status === "open") ticket.status = "pending";
  ticket.updated_at = new Date().toISOString();

  return { ok: true };
}

export async function updateTicketStatus(
  id: string,
  status: SupportTicketStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const ticket = store.supportTickets.find((t) => t.id === id);
  if (!ticket) return { ok: false, error: "Ticket not found" };

  ticket.status = status;
  ticket.updated_at = new Date().toISOString();

  return { ok: true };
}
