import { store } from "@/lib/mock/store";
import type { TxType, TransactionWithContext } from "@/lib/types";

export async function listTransactions(type?: TxType | "all"): Promise<TransactionWithContext[]> {
  const matches = !type || type === "all" ? store.transactions : store.transactions.filter((t) => t.type === type);
  return [...matches]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((t) => {
      const escrow = t.escrow_id ? store.escrows.find((e) => e.id === t.escrow_id) : undefined;
      const wallet = t.wallet_id ? store.wallets.find((w) => w.id === t.wallet_id) : undefined;
      const owner = wallet ? store.users.find((u) => u.id === wallet.user_id) : undefined;
      return {
        ...t,
        escrow_title: escrow?.title,
        counterparty: owner ? { id: owner.id, full_name: owner.full_name } : undefined,
      };
    });
}

export const TX_TYPES: TxType[] = [
  "deposit",
  "release",
  "refund",
  "platform_fee",
  "wallet_topup",
  "wallet_debit",
  "wallet_withdrawal",
];
