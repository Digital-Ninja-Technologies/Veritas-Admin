/**
 * Types mirroring `veritas-backend`'s `internal/models/models.go` field for
 * field (snake_case, matching the JSON wire format) so that swapping the
 * mock data layer (`lib/data/*`) for real `fetch` calls to the API is a
 * drop-in change — no reshaping needed at the call sites.
 *
 * Money is always in kobo (smallest NGN unit), matching the backend.
 */

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string;
  created_at: string;
}

export type EscrowStatus =
  | "pending"
  | "funded"
  | "active"
  | "disputed"
  | "completed"
  | "refunded"
  | "cancelled";

export type PaymentMethod = "naira" | "crypto";

export interface Escrow {
  id: string;
  title: string;
  description: string;
  client_id: string;
  freelancer_id: string;
  amount_kobo: number;
  platform_fee_kobo: number;
  status: EscrowStatus;
  payment_method: PaymentMethod;
  nomba_virtual_account_ref?: string;
  nomba_virtual_account_number?: string;
  nomba_virtual_bank_name?: string;
  onswitch_deposit_address?: string;
  onswitch_deposit_chain?: string;
  deadline_at: string;
  created_at: string;
  updated_at: string;
  funded_at?: string;
  completed_at?: string;
}

export type MilestoneStatus =
  | "pending"
  | "delivered"
  | "approved"
  | "rejected"
  | "released"
  | "changes_requested";

export interface Milestone {
  id: string;
  escrow_id: string;
  title: string;
  description: string;
  amount_kobo: number;
  status: MilestoneStatus;
  delivery_note?: string;
  delivery_link?: string;
  revision_note?: string;
  due_at?: string;
  created_at: string;
  updated_at: string;
}

export type TxType =
  | "deposit"
  | "release"
  | "refund"
  | "platform_fee"
  | "wallet_topup"
  | "wallet_debit"
  | "wallet_withdrawal";

export interface Transaction {
  id: string;
  escrow_id?: string;
  milestone_id?: string;
  wallet_id?: string;
  type: TxType;
  amount_kobo: number;
  nomba_session_id?: string;
  nomba_tx_ref?: string;
  status: string;
  metadata: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance_kobo: number;
  nomba_virtual_account_ref?: string;
  nomba_virtual_account_number?: string;
  nomba_virtual_bank_name?: string;
  created_at: string;
  updated_at: string;
}

export type DisputeStatus = "open" | "reviewing" | "resolved";

export type DisputeResolution = "release_to_seller" | "refund_to_buyer" | "split";

export interface Dispute {
  id: string;
  escrow_id: string;
  raised_by: string;
  reason: string;
  status: DisputeStatus;
  resolution?: DisputeResolution;
  admin_note?: string;
  resolved_by?: string;
  created_at: string;
  resolved_at?: string;
}

export type SupportTicketStatus = "open" | "pending" | "closed";

export type SupportTicketCategory = "escrow" | "payment" | "account" | "dispute" | "other";

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_role: UserRole;
  body: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  created_at: string;
  updated_at: string;
}

/**
 * View-model shapes the dashboard actually renders — denormalized with
 * party names so list/detail pages don't need N+1 user lookups. The mock
 * data layer assembles these from the raw entities above; once the backend
 * exposes an admin user list, the real API can either return these shapes
 * directly or the data layer can keep doing the join client-side.
 */
export interface EscrowWithParties extends Escrow {
  client: Pick<User, "id" | "full_name" | "email">;
  freelancer: Pick<User, "id" | "full_name" | "email">;
  milestones: Milestone[];
}

export interface DisputeWithContext extends Dispute {
  escrow: Pick<Escrow, "id" | "title" | "amount_kobo" | "status">;
  raised_by_user: Pick<User, "id" | "full_name" | "email">;
  client: Pick<User, "id" | "full_name" | "email">;
  freelancer: Pick<User, "id" | "full_name" | "email">;
}

export interface TransactionWithContext extends Transaction {
  escrow_title?: string;
  counterparty?: Pick<User, "id" | "full_name">;
}

export interface UserWithStats extends User {
  wallet_balance_kobo: number;
  escrows_as_client: number;
  escrows_as_freelancer: number;
}

export interface SupportTicketWithContext extends SupportTicket {
  user: Pick<User, "id" | "full_name" | "email">;
  messages: SupportMessage[];
}
