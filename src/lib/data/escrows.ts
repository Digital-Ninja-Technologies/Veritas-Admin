import { store } from "@/lib/mock/store";
import { userLabel } from "./users";
import type { Escrow, EscrowStatus, EscrowWithParties } from "@/lib/types";

function withParties(escrow: Escrow): EscrowWithParties {
  return {
    ...escrow,
    client: userLabel(escrow.client_id),
    freelancer: userLabel(escrow.freelancer_id),
    milestones: store.milestones.filter((m) => m.escrow_id === escrow.id),
  };
}

export async function listEscrows(status?: EscrowStatus | "all"): Promise<EscrowWithParties[]> {
  const matches =
    !status || status === "all" ? store.escrows : store.escrows.filter((e) => e.status === status);
  return [...matches]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(withParties);
}

export async function getEscrow(id: string): Promise<EscrowWithParties | undefined> {
  const escrow = store.escrows.find((e) => e.id === id);
  return escrow ? withParties(escrow) : undefined;
}

export async function listEscrowTransactions(escrowId: string) {
  return store.transactions.filter((t) => t.escrow_id === escrowId);
}

export async function listEscrowsForUser(userId: string): Promise<EscrowWithParties[]> {
  return store.escrows
    .filter((e) => e.client_id === userId || e.freelancer_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(withParties);
}

export const ESCROW_STATUSES: EscrowStatus[] = [
  "pending",
  "funded",
  "active",
  "disputed",
  "completed",
  "refunded",
  "cancelled",
];
