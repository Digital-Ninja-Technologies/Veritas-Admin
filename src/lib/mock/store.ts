import {
  disputes,
  escrows,
  faqs,
  milestones,
  staffCredentials,
  supportMessages,
  supportTickets,
  teamInvites,
  transactions,
  users,
  wallets,
} from "./seed";
import type {
  Dispute,
  Escrow,
  FaqEntry,
  Milestone,
  SupportMessage,
  SupportTicket,
  TeamInvite,
  Transaction,
  User,
  Wallet,
} from "@/lib/types";

/**
 * Mutable in-memory store seeded from `seed.ts`. Stands in for the
 * Postgres-backed `veritas-backend` API — every `lib/data/*` function reads
 * and writes through here. Module-level state resets on server restart,
 * which is fine for this mock phase (see README).
 */
class MockStore {
  users: User[] = structuredClone(users);
  wallets: Wallet[] = structuredClone(wallets);
  escrows: Escrow[] = structuredClone(escrows);
  milestones: Milestone[] = structuredClone(milestones);
  disputes: Dispute[] = structuredClone(disputes);
  transactions: Transaction[] = structuredClone(transactions);
  supportTickets: SupportTicket[] = structuredClone(supportTickets);
  supportMessages: SupportMessage[] = structuredClone(supportMessages);
  faqs: FaqEntry[] = structuredClone(faqs);
  teamInvites: TeamInvite[] = structuredClone(teamInvites);
  staffCredentials: { user_id: string; password: string }[] = structuredClone(staffCredentials);
}

declare global {
  var __veritasMockStore: MockStore | undefined;
}

// Survive Next.js dev-server hot reloads by stashing the instance globally.
export const store: MockStore = globalThis.__veritasMockStore ?? new MockStore();
globalThis.__veritasMockStore = store;
