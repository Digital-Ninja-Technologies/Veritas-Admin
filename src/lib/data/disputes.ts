import { store } from "@/lib/mock/store";
import { userLabel } from "./users";
import type { Dispute, DisputeResolution, DisputeStatus, DisputeWithContext } from "@/lib/types";

function withContext(dispute: Dispute): DisputeWithContext {
  const escrow = store.escrows.find((e) => e.id === dispute.escrow_id);
  return {
    ...dispute,
    escrow: escrow
      ? { id: escrow.id, title: escrow.title, amount_kobo: escrow.amount_kobo, status: escrow.status }
      : { id: dispute.escrow_id, title: "Unknown escrow", amount_kobo: 0, status: "cancelled" },
    raised_by_user: userLabel(dispute.raised_by),
    client: userLabel(escrow?.client_id ?? ""),
    freelancer: userLabel(escrow?.freelancer_id ?? ""),
  };
}

export async function listDisputes(status?: DisputeStatus | "all"): Promise<DisputeWithContext[]> {
  const matches =
    !status || status === "all" ? store.disputes : store.disputes.filter((d) => d.status === status);
  return [...matches]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(withContext);
}

export async function getDispute(id: string): Promise<DisputeWithContext | undefined> {
  const dispute = store.disputes.find((d) => d.id === id);
  return dispute ? withContext(dispute) : undefined;
}

/**
 * Mirrors `EscrowService.ResolveDispute` in veritas-backend
 * (internal/services/escrow.go): release pays the freelancer the full
 * amount and completes the escrow; refund pays the client back and marks
 * the escrow refunded; split pays half to each party (escrow still ends up
 * "refunded" — matching the real backend's behavior, not a mock bug).
 */
export async function resolveDispute(
  id: string,
  resolution: DisputeResolution,
  adminNote: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const dispute = store.disputes.find((d) => d.id === id);
  if (!dispute) return { ok: false, error: "Dispute not found" };
  if (dispute.status === "resolved") return { ok: false, error: "Dispute already resolved" };

  const escrow = store.escrows.find((e) => e.id === dispute.escrow_id);
  if (!escrow) return { ok: false, error: "Escrow not found" };

  const creditWallet = (userId: string, amountKobo: number, type: "release" | "refund") => {
    const wallet = store.wallets.find((w) => w.user_id === userId);
    if (wallet) {
      wallet.balance_kobo += amountKobo;
      wallet.updated_at = new Date().toISOString();
    }
    store.transactions.unshift({
      id: `txn-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      escrow_id: escrow.id,
      wallet_id: wallet?.id,
      type,
      amount_kobo: amountKobo,
      status: "success",
      metadata: "{}",
      created_at: new Date().toISOString(),
    });
  };

  if (resolution === "release_to_seller") {
    creditWallet(escrow.freelancer_id, escrow.amount_kobo, "release");
    escrow.status = "completed";
  } else if (resolution === "refund_to_buyer") {
    creditWallet(escrow.client_id, escrow.amount_kobo, "refund");
    escrow.status = "refunded";
  } else {
    const half = Math.floor(escrow.amount_kobo / 2);
    creditWallet(escrow.freelancer_id, half, "release");
    creditWallet(escrow.client_id, escrow.amount_kobo - half, "refund");
    escrow.status = "refunded";
  }
  escrow.updated_at = new Date().toISOString();

  dispute.status = "resolved";
  dispute.resolution = resolution;
  dispute.admin_note = adminNote;
  dispute.resolved_by = "usr-admin";
  dispute.resolved_at = new Date().toISOString();

  return { ok: true };
}
