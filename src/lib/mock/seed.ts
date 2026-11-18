import type {
  Dispute,
  Escrow,
  FaqEntry,
  Milestone,
  SupportMessage,
  SupportTicket,
  Transaction,
  User,
  Wallet,
} from "@/lib/types";

/**
 * In-memory seed data standing in for `veritas-backend`'s Postgres tables.
 * Shapes match the real schema exactly (see `lib/types.ts`), so the
 * functions in `lib/data/*` are the only place that would need to change
 * when this is wired to the real API.
 */

function uid(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(4, "0")}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const users: User[] = [
  { id: uid("usr", 1), email: "amaka.o@novateq.ng", full_name: "Amaka Obi", role: "user", phone: "+234 802 415 8842", created_at: daysAgo(210) },
  { id: uid("usr", 2), email: "daniel@okaforstudio.co", full_name: "Daniel Okafor", role: "user", phone: "+234 803 112 7731", created_at: daysAgo(198) },
  { id: uid("usr", 3), email: "zara@zaratech.io", full_name: "Zara Mensah", role: "user", phone: "+234 701 556 9023", created_at: daysAgo(180) },
  { id: uid("usr", 4), email: "kojo@kojodesign.gh", full_name: "Kojo Asante", role: "user", phone: "+234 809 334 1120", created_at: daysAgo(165) },
  { id: uid("usr", 5), email: "linda@ezecreative.com", full_name: "Linda Eze", role: "user", phone: "+234 813 220 4456", created_at: daysAgo(140) },
  { id: uid("usr", 6), email: "chidi@northwind.co", full_name: "Chidi Nwosu", role: "user", phone: "+234 704 887 2290", created_at: daysAgo(120) },
  { id: uid("usr", 7), email: "priya@sharmadigital.com", full_name: "Priya Sharma", role: "user", phone: "+234 816 905 3317", created_at: daysAgo(95) },
  { id: uid("usr", 8), email: "tunde@vertexlabs.ng", full_name: "Tunde Bakare", role: "user", phone: "+234 705 441 8863", created_at: daysAgo(60) },
  { id: uid("usr", 9), email: "ifeoma@brightworks.ng", full_name: "Ifeoma Chukwu", role: "user", phone: "+234 802 773 1145", created_at: daysAgo(30) },
  { id: "usr-admin", email: "admin@useveritasapp.com", full_name: "Veritas Admin", role: "admin", phone: "+234 800 000 0000", created_at: daysAgo(400) },
];

export const wallets: Wallet[] = users
  .filter((u) => u.role === "user")
  .map((u, i) => ({
    id: uid("wal", i + 1),
    user_id: u.id,
    balance_kobo: [128_000_00, 45_000_00, 0, 312_500_00, 18_200_00, 540_000_00, 76_000_00, 0, 9_800_00][i] ?? 0,
    nomba_virtual_account_ref: `va-${u.id}`,
    nomba_virtual_account_number: `90${(1000000 + i * 37).toString().slice(-8)}`,
    nomba_virtual_bank_name: "Providus Bank",
    created_at: u.created_at,
    updated_at: daysAgo(Math.max(0, 10 - i)),
  }));

function milestonesFor(
  escrowId: string,
  defs: Array<{
    title: string;
    description: string;
    amountKobo: number;
    status: Milestone["status"];
    dueInDays?: number;
    deliveryNote?: string;
    deliveryLink?: string;
    revisionNote?: string;
  }>,
): Milestone[] {
  return defs.map((d, i) => ({
    id: uid(`${escrowId}-ms`, i + 1),
    escrow_id: escrowId,
    title: d.title,
    description: d.description,
    amount_kobo: d.amountKobo,
    status: d.status,
    delivery_note: d.deliveryNote,
    delivery_link: d.deliveryLink,
    revision_note: d.revisionNote,
    due_at: d.dueInDays !== undefined ? daysFromNow(d.dueInDays) : undefined,
    created_at: daysAgo(20),
    updated_at: daysAgo(1),
  }));
}

export const escrows: Escrow[] = [
  {
    id: uid("esc", 1),
    title: "Mobile App Redesign — Novateq",
    description: "Full UI/UX redesign of the Novateq customer app, 3 milestones.",
    client_id: uid("usr", 1),
    freelancer_id: uid("usr", 2),
    amount_kobo: 650_000_00,
    platform_fee_kobo: 9_750_00,
    status: "active",
    payment_method: "naira",
    nomba_virtual_account_ref: "va-esc-0001",
    nomba_virtual_account_number: "9012345671",
    nomba_virtual_bank_name: "Providus Bank",
    deadline_at: daysFromNow(14),
    created_at: daysAgo(25),
    updated_at: daysAgo(1),
    funded_at: daysAgo(24),
  },
  {
    id: uid("esc", 2),
    title: "Brand Identity System — Northwind",
    description: "Logo, brand guidelines, and stationery for Northwind Co.",
    client_id: uid("usr", 6),
    freelancer_id: uid("usr", 2),
    amount_kobo: 240_000_00,
    platform_fee_kobo: 3_600_00,
    status: "funded",
    payment_method: "naira",
    deadline_at: daysFromNow(20),
    created_at: daysAgo(10),
    updated_at: daysAgo(10),
    funded_at: daysAgo(10),
  },
  {
    id: uid("esc", 3),
    title: "Marketing Website — Vertex Labs",
    description: "Copywriting, design, and build of the Vertex Labs marketing site.",
    client_id: uid("usr", 8),
    freelancer_id: uid("usr", 2),
    amount_kobo: 320_000_00,
    platform_fee_kobo: 4_800_00,
    status: "completed",
    payment_method: "naira",
    deadline_at: daysAgo(5),
    created_at: daysAgo(70),
    updated_at: daysAgo(5),
    funded_at: daysAgo(68),
    completed_at: daysAgo(5),
  },
  {
    id: uid("esc", 4),
    title: "Podcast Cover Art — Amaka",
    description: "3 concept covers + final delivery for Amaka's new podcast.",
    client_id: uid("usr", 1),
    freelancer_id: uid("usr", 3),
    amount_kobo: 150_000_00,
    platform_fee_kobo: 2_250_00,
    status: "disputed",
    payment_method: "naira",
    deadline_at: daysAgo(2),
    created_at: daysAgo(18),
    updated_at: daysAgo(1),
    funded_at: daysAgo(17),
  },
  {
    id: uid("esc", 5),
    title: "Webflow Build — Sharma Digital",
    description: "CMS setup and full Webflow build for Sharma Digital.",
    client_id: uid("usr", 1),
    freelancer_id: uid("usr", 7),
    amount_kobo: 300_000_00,
    platform_fee_kobo: 4_500_00,
    status: "active",
    payment_method: "naira",
    deadline_at: daysFromNow(9),
    created_at: daysAgo(15),
    updated_at: daysAgo(2),
    funded_at: daysAgo(14),
  },
  {
    id: uid("esc", 6),
    title: "Product Design — BrightWorks",
    description: "End-to-end product design for the BrightWorks onboarding flow.",
    client_id: uid("usr", 9),
    freelancer_id: uid("usr", 4),
    amount_kobo: 180_000_00,
    platform_fee_kobo: 2_700_00,
    status: "pending",
    payment_method: "naira",
    deadline_at: daysFromNow(30),
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
  {
    id: uid("esc", 7),
    title: "Copywriting Sprint — Northwind",
    description: "Landing page + email sequence copy for a Northwind product launch.",
    client_id: uid("usr", 6),
    freelancer_id: uid("usr", 5),
    amount_kobo: 95_000_00,
    platform_fee_kobo: 1_425_00,
    status: "refunded",
    payment_method: "naira",
    deadline_at: daysAgo(12),
    created_at: daysAgo(40),
    updated_at: daysAgo(11),
    funded_at: daysAgo(38),
  },
  {
    id: uid("esc", 8),
    title: "Illustration Set — Zara Tech",
    description: "8-illustration set for the Zara Tech product launch deck.",
    client_id: uid("usr", 3),
    freelancer_id: uid("usr", 5),
    amount_kobo: 110_000_00,
    platform_fee_kobo: 1_650_00,
    status: "cancelled",
    payment_method: "naira",
    deadline_at: daysAgo(30),
    created_at: daysAgo(45),
    updated_at: daysAgo(44),
  },
];

export const milestones: Milestone[] = [
  ...milestonesFor(uid("esc", 1), [
    { title: "Discovery & wireframes", description: "Research, IA, and low-fidelity wireframes.", amountKobo: 130_000_00, status: "released" },
    {
      title: "UI design — 24 screens",
      description: "High-fidelity UI for all 24 app screens.",
      amountKobo: 260_000_00,
      status: "delivered",
      deliveryNote: "Delivered all 24 screens as Figma + exported PNGs, covering the full redesign spec.",
      deliveryLink: "https://figma.com/file/novateq-redesign",
    },
    { title: "Prototype & dev handoff", description: "Interactive prototype and engineering handoff docs.", amountKobo: 260_000_00, status: "pending", dueInDays: 14 },
  ]),
  ...milestonesFor(uid("esc", 2), [
    { title: "Logo & core marks", description: "Primary logo, wordmark, and icon.", amountKobo: 120_000_00, status: "pending", dueInDays: 7 },
    { title: "Brand guidelines", description: "Full brand guideline document.", amountKobo: 120_000_00, status: "pending", dueInDays: 20 },
  ]),
  ...milestonesFor(uid("esc", 3), [
    { title: "Copy & content", description: "All site copy, SEO-optimized.", amountKobo: 100_000_00, status: "released" },
    { title: "Design & build", description: "Full design and Webflow build.", amountKobo: 220_000_00, status: "released" },
  ]),
  ...milestonesFor(uid("esc", 4), [
    {
      title: "3 cover concepts",
      description: "Three distinct cover art directions.",
      amountKobo: 75_000_00,
      status: "rejected",
      deliveryNote: "Delivered 3 cover directions as 3000x3000 PNGs.",
      deliveryLink: "https://drive.google.com/podcast-covers",
      revisionNote: "None of the 3 directions match the brief's requested color palette — needs rework.",
    },
    { title: "Final delivery + files", description: "Final chosen cover + source files.", amountKobo: 75_000_00, status: "pending" },
  ]),
  ...milestonesFor(uid("esc", 5), [
    { title: "CMS setup", description: "Webflow CMS collections and structure.", amountKobo: 100_000_00, status: "released" },
    { title: "Full build & launch", description: "Complete build, QA, and launch.", amountKobo: 200_000_00, status: "delivered", deliveryNote: "Site built, QA'd across devices, ready for launch review.", deliveryLink: "https://sharma-digital.webflow.io" },
  ]),
  ...milestonesFor(uid("esc", 6), [
    { title: "Onboarding flow design", description: "Full onboarding UX + UI.", amountKobo: 180_000_00, status: "pending", dueInDays: 30 },
  ]),
  ...milestonesFor(uid("esc", 7), [
    { title: "Landing page copy", description: "Full landing page copywriting.", amountKobo: 45_000_00, status: "rejected" },
    { title: "Email sequence", description: "5-part launch email sequence.", amountKobo: 50_000_00, status: "pending" },
  ]),
  ...milestonesFor(uid("esc", 8), [
    { title: "8-illustration set", description: "Full illustration set for the deck.", amountKobo: 110_000_00, status: "pending" },
  ]),
];

export const disputes: Dispute[] = [
  {
    id: uid("dsp", 1),
    escrow_id: uid("esc", 4),
    raised_by: uid("usr", 1),
    reason: "Delivered concepts don't match the brief's color palette, and the freelancer hasn't responded to revision requests in 4 days.",
    status: "open",
    created_at: daysAgo(1),
  },
  {
    id: uid("dsp", 2),
    escrow_id: uid("esc", 7),
    raised_by: uid("usr", 6),
    reason: "Copy delivered late and didn't follow the agreed tone of voice guide.",
    status: "resolved",
    resolution: "refund_to_buyer",
    admin_note: "Reviewed the brief vs. delivered copy — freelancer missed the agreed tone guide on 3 of 5 sections and delivered 6 days past deadline. Full refund to client.",
    resolved_by: "usr-admin",
    created_at: daysAgo(14),
    resolved_at: daysAgo(11),
  },
  {
    id: uid("dsp", 3),
    escrow_id: uid("esc", 3),
    raised_by: uid("usr", 2),
    reason: "Client requested scope beyond the original agreement without adjusting payment.",
    status: "reviewing",
    created_at: daysAgo(3),
  },
];

const activityTxns: Transaction[] = [
  { id: uid("txn", 1), escrow_id: uid("esc", 1), milestone_id: uid(`${uid("esc", 1)}-ms`, 1), type: "deposit", amount_kobo: 650_000_00, status: "success", metadata: "{}", created_at: daysAgo(24) },
  { id: uid("txn", 2), escrow_id: uid("esc", 1), milestone_id: uid(`${uid("esc", 1)}-ms`, 1), type: "platform_fee", amount_kobo: 9_750_00, status: "success", metadata: "{}", created_at: daysAgo(24) },
  { id: uid("txn", 3), escrow_id: uid("esc", 1), milestone_id: uid(`${uid("esc", 1)}-ms`, 1), type: "release", amount_kobo: 130_000_00, status: "success", metadata: "{}", created_at: daysAgo(12) },
  { id: uid("txn", 4), escrow_id: uid("esc", 3), type: "deposit", amount_kobo: 320_000_00, status: "success", metadata: "{}", created_at: daysAgo(68) },
  { id: uid("txn", 5), escrow_id: uid("esc", 3), milestone_id: uid(`${uid("esc", 3)}-ms`, 1), type: "release", amount_kobo: 100_000_00, status: "success", metadata: "{}", created_at: daysAgo(40) },
  { id: uid("txn", 6), escrow_id: uid("esc", 3), milestone_id: uid(`${uid("esc", 3)}-ms`, 2), type: "release", amount_kobo: 220_000_00, status: "success", metadata: "{}", created_at: daysAgo(5) },
  { id: uid("txn", 7), escrow_id: uid("esc", 5), type: "deposit", amount_kobo: 300_000_00, status: "success", metadata: "{}", created_at: daysAgo(14) },
  { id: uid("txn", 8), escrow_id: uid("esc", 5), milestone_id: uid(`${uid("esc", 5)}-ms`, 1), type: "release", amount_kobo: 100_000_00, status: "success", metadata: "{}", created_at: daysAgo(6) },
  { id: uid("txn", 9), escrow_id: uid("esc", 2), type: "deposit", amount_kobo: 240_000_00, status: "success", metadata: "{}", created_at: daysAgo(10) },
  { id: uid("txn", 10), escrow_id: uid("esc", 4), type: "deposit", amount_kobo: 150_000_00, status: "success", metadata: "{}", created_at: daysAgo(17) },
  { id: uid("txn", 11), escrow_id: uid("esc", 7), type: "deposit", amount_kobo: 95_000_00, status: "success", metadata: "{}", created_at: daysAgo(38) },
  { id: uid("txn", 12), escrow_id: uid("esc", 7), type: "refund", amount_kobo: 95_000_00, status: "success", metadata: "{}", created_at: daysAgo(11) },
  { id: uid("txn", 13), wallet_id: uid("wal", 1), type: "wallet_topup", amount_kobo: 128_000_00, status: "success", nomba_tx_ref: "nomba-tx-77123", metadata: "{}", created_at: daysAgo(8) },
  { id: uid("txn", 14), wallet_id: uid("wal", 4), type: "wallet_topup", amount_kobo: 312_500_00, status: "success", nomba_tx_ref: "nomba-tx-77240", metadata: "{}", created_at: daysAgo(4) },
  { id: uid("txn", 15), wallet_id: uid("wal", 6), type: "wallet_withdrawal", amount_kobo: 85_000_00, status: "success", nomba_tx_ref: "nomba-tx-77301", metadata: "{}", created_at: daysAgo(2) },
  { id: uid("txn", 16), wallet_id: uid("wal", 2), type: "wallet_debit", amount_kobo: 20_000_00, status: "success", metadata: "{}", created_at: daysAgo(1) },
];

export const transactions: Transaction[] = [...activityTxns].sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
);

function ticketMessages(
  ticketId: string,
  userId: string,
  thread: Array<{ from: "user" | "admin"; body: string; daysAgoSent: number }>,
): SupportMessage[] {
  return thread.map((m, i) => ({
    id: uid(`${ticketId}-msg`, i + 1),
    ticket_id: ticketId,
    sender_id: m.from === "admin" ? "usr-admin" : userId,
    sender_role: m.from,
    body: m.body,
    created_at: daysAgo(m.daysAgoSent),
  }));
}

export const supportTickets: SupportTicket[] = [
  {
    id: uid("tkt", 1),
    user_id: uid("usr", 5),
    subject: "Can't verify my bank account",
    category: "payment",
    status: "open",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
  {
    id: uid("tkt", 2),
    user_id: uid("usr", 3),
    subject: "Escrow funds not showing in my wallet",
    category: "escrow",
    status: "pending",
    created_at: daysAgo(4),
    updated_at: daysAgo(2),
  },
  {
    id: uid("tkt", 3),
    user_id: uid("usr", 9),
    subject: "How do I change my account email address?",
    category: "account",
    status: "pending",
    created_at: daysAgo(6),
    updated_at: daysAgo(3),
  },
  {
    id: uid("tkt", 4),
    user_id: uid("usr", 6),
    subject: "Payout took longer than expected",
    category: "payment",
    status: "closed",
    created_at: daysAgo(20),
    updated_at: daysAgo(17),
  },
  {
    id: uid("tkt", 5),
    user_id: uid("usr", 8),
    subject: "Question about how the dispute process works",
    category: "dispute",
    status: "open",
    created_at: daysAgo(0),
    updated_at: daysAgo(0),
  },
  {
    id: uid("tkt", 6),
    user_id: uid("usr", 2),
    subject: "App crashes when uploading delivery files",
    category: "other",
    status: "closed",
    created_at: daysAgo(35),
    updated_at: daysAgo(33),
  },
];

export const supportMessages: SupportMessage[] = [
  ...ticketMessages(uid("tkt", 1), uid("usr", 5), [
    {
      from: "user",
      body: "I've uploaded my BVN and bank details twice now but my wallet still says 'unverified'. Can someone check what's going on?",
      daysAgoSent: 1,
    },
  ]),
  ...ticketMessages(uid("tkt", 2), uid("usr", 3), [
    {
      from: "user",
      body: "I funded the Illustration Set escrow 2 days ago but I don't see it reflected anywhere on my side. Is this expected?",
      daysAgoSent: 4,
    },
    {
      from: "admin",
      body: "Thanks for flagging this — funded escrow balances show on the escrow detail page, not the wallet (your wallet only tracks direct top-ups/withdrawals). I've double-checked and your deposit went through fine. Let me know if that clears it up.",
      daysAgoSent: 2,
    },
  ]),
  ...ticketMessages(uid("tkt", 3), uid("usr", 9), [
    {
      from: "user",
      body: "I need to switch my account email from my old work address to a personal one. Where do I do that?",
      daysAgoSent: 6,
    },
    {
      from: "admin",
      body: "We don't have self-serve email changes yet — I can update it for you here. What's the new email address you'd like on file?",
      daysAgoSent: 5,
    },
    {
      from: "user",
      body: "Thanks! It's ifeoma.c.personal@gmail.com — appreciate the quick help.",
      daysAgoSent: 3,
    },
  ]),
  ...ticketMessages(uid("tkt", 4), uid("usr", 6), [
    {
      from: "user",
      body: "My payout for the Copywriting Sprint refund was marked successful 3 days ago but I still haven't seen it land.",
      daysAgoSent: 20,
    },
    {
      from: "admin",
      body: "Sorry about the delay — this was held up on Providus Bank's end during a settlement window. I've confirmed with Nomba that it's cleared now.",
      daysAgoSent: 18,
    },
    {
      from: "user",
      body: "Confirmed, it landed this morning. Thanks for sorting it out.",
      daysAgoSent: 17,
    },
  ]),
  ...ticketMessages(uid("tkt", 5), uid("usr", 8), [
    {
      from: "user",
      body: "If a dispute gets raised on one of my escrows, how long does resolution usually take, and can I add more evidence after the initial reason is submitted?",
      daysAgoSent: 0,
    },
  ]),
  ...ticketMessages(uid("tkt", 6), uid("usr", 2), [
    {
      from: "user",
      body: "The app crashes every time I try to attach a delivery file over ~15MB on the milestone delivery screen.",
      daysAgoSent: 35,
    },
    {
      from: "admin",
      body: "Thanks for the report — that's a known upload-size limit issue, fixed in the latest app version. Could you update and try again?",
      daysAgoSent: 34,
    },
    {
      from: "user",
      body: "Updated and it works now, thank you!",
      daysAgoSent: 33,
    },
  ]),
];

function faqEntry(
  n: number,
  category: FaqEntry["category"],
  question: string,
  answer: string,
  updatedDaysAgo: number,
): FaqEntry {
  return {
    id: uid("faq", n),
    category,
    question,
    answer,
    created_at: daysAgo(updatedDaysAgo + 30),
    updated_at: daysAgo(updatedDaysAgo),
  };
}

export const faqs: FaqEntry[] = [
  faqEntry(
    1,
    "escrow",
    "How does Veritas escrow work?",
    "A client funds an escrow for the agreed amount, work happens in milestones, and funds for each milestone are released to the freelancer once the client approves the delivery. Money only moves when both sides agree, or when an admin resolves a dispute.",
    10,
  ),
  faqEntry(
    2,
    "escrow",
    "When are funds released to the freelancer?",
    "As soon as a client approves a milestone delivery, that milestone's funds are released to the freelancer's wallet immediately — there's no additional waiting period.",
    10,
  ),
  faqEntry(
    3,
    "payment",
    "What payment methods does Veritas support?",
    "Escrows can be funded in Naira via bank transfer to a dedicated virtual account, or in crypto via an on-chain deposit address. Both are shown on the escrow's funding screen once it's created.",
    8,
  ),
  faqEntry(
    4,
    "payment",
    "How long do wallet withdrawals take?",
    "Withdrawals to a verified bank account are usually processed within a few hours, and almost always same-day. Occasional delays can happen during bank settlement windows — our team monitors these and follows up if a payout takes longer than 24 hours.",
    6,
  ),
  faqEntry(
    5,
    "account",
    "How do I verify my bank account?",
    "Go to Wallet settings and submit your BVN along with the bank account you want to use for withdrawals. Verification is usually instant; if it's stuck for more than a few minutes, reach out and we'll check it manually.",
    4,
  ),
  faqEntry(
    6,
    "account",
    "Can I change the email address on my account?",
    "Not yet as a self-serve option — contact support with your old and new email addresses and we'll update it for you.",
    3,
  ),
  faqEntry(
    7,
    "dispute",
    "What happens if I raise a dispute on an escrow?",
    "The escrow is frozen (no further releases) and an admin reviews the milestone history, delivery notes, and both parties' messages. Most disputes are resolved within 2–3 business days with one of three outcomes: release to the freelancer, refund to the client, or a 50/50 split.",
    5,
  ),
  faqEntry(
    8,
    "dispute",
    "Can I add more context after I've raised a dispute?",
    "Yes — reply on the support ticket linked to your dispute with any extra context, screenshots, or messages, and it'll be reviewed before a decision is made.",
    5,
  ),
  faqEntry(
    9,
    "other",
    "Is there a mobile app?",
    "Yes, Veritas is available on iOS and Android. This admin dashboard is a separate, internal tool for the Veritas team only.",
    12,
  ),
];
