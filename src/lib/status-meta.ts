import type { DisputeStatus, EscrowStatus, MilestoneStatus, SupportTicketStatus, TxType } from "@/lib/types";

export type BadgeTone = "success" | "warning" | "info" | "destructive" | "secondary";

export const escrowStatusTone: Record<EscrowStatus, BadgeTone> = {
  pending: "secondary",
  funded: "info",
  active: "warning",
  disputed: "destructive",
  completed: "success",
  refunded: "secondary",
  cancelled: "secondary",
};

export const milestoneStatusTone: Record<MilestoneStatus, BadgeTone> = {
  pending: "secondary",
  delivered: "info",
  approved: "success",
  rejected: "destructive",
  released: "success",
  changes_requested: "warning",
};

export const disputeStatusTone: Record<DisputeStatus, BadgeTone> = {
  open: "destructive",
  reviewing: "warning",
  resolved: "success",
};

export const supportStatusTone: Record<SupportTicketStatus, BadgeTone> = {
  open: "destructive",
  pending: "warning",
  closed: "success",
};

export const txTypeTone: Record<TxType, BadgeTone> = {
  deposit: "success",
  release: "success",
  refund: "warning",
  platform_fee: "secondary",
  wallet_topup: "success",
  wallet_debit: "secondary",
  wallet_withdrawal: "info",
};
