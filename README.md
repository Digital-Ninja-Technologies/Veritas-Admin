# Veritas Admin

Internal admin dashboard for the [Veritas](https://www.useveritasapp.com) escrow platform. Gives the Veritas team visibility into escrows, disputes, users, and transactions, and a workflow for resolving disputes.

**Website:** [www.useveritasapp.com](https://www.useveritasapp.com)

## Stack

- [Next.js](https://nextjs.org) (App Router, Turbopack) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (new-york-v4)
- [Recharts](https://recharts.org) for charts
- Server Actions for mutations, cookie-based mock session auth

## Data

This app currently runs on an in-memory mock data layer (`src/lib/mock`) seeded with representative Veritas data, shaped to match `veritas-backend`'s wire format (snake_case fields, amounts in kobo) so the `src/lib/data/*` functions can be swapped for real API calls later without touching the UI.

## Features

- **Overview** — platform-wide metrics, funded volume over time, escrow status breakdown, recent activity
- **Escrows** — list and detail views across the full escrow lifecycle
- **Disputes** — list, detail, and a resolution flow (release to freelancer, refund to client, or 50/50 split)
- **Users** — list and detail views with escrow/transaction history
- **Transactions** — platform-wide ledger with type filtering

## Getting started

```bash
npm install
npm run dev
```

Log in with the seeded admin account shown on the login page.

## Build

```bash
npm run build
npm run start
```
