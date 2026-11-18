import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, CreditCard, Wallet } from "lucide-react";

import { getEscrow, listEscrowTransactions } from "@/lib/data/escrows";
import { formatNaira, formatDate, formatDateTime, initials } from "@/lib/format";
import { escrowStatusTone, milestoneStatusTone, txTypeTone } from "@/lib/status-meta";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function EscrowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [escrow, transactions] = await Promise.all([getEscrow(id), listEscrowTransactions(id)]);

  if (!escrow) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
        <Link href="/escrows">
          <ArrowLeft />
          Back to escrows
        </Link>
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{escrow.title}</h2>
            <StatusBadge status={escrow.status} tone={escrowStatusTone[escrow.status]} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{escrow.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{formatNaira(escrow.amount_kobo)}</p>
          <p className="text-xs text-muted-foreground">+{formatNaira(escrow.platform_fee_kobo)} platform fee</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {escrow.milestones.map((m, i) => (
                <div key={m.id}>
                  {i > 0 ? <Separator className="mb-4" /> : null}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{m.title}</p>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="font-medium">{formatNaira(m.amount_kobo)}</span>
                      <StatusBadge status={m.status} tone={milestoneStatusTone[m.status]} />
                    </div>
                  </div>
                  {m.delivery_note ? (
                    <div className="mt-3 rounded-md bg-muted/60 p-3 text-sm">
                      <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                        Delivery note
                      </p>
                      <p className="mt-1">{m.delivery_note}</p>
                      {m.delivery_link ? (
                        <a
                          href={m.delivery_link.startsWith("http") ? m.delivery_link : `https://${m.delivery_link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-blue-600 underline"
                        >
                          {m.delivery_link}
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                  {m.revision_note ? (
                    <div className="mt-3 rounded-md bg-warning/60 p-3 text-sm">
                      <p className="font-medium text-xs uppercase tracking-wide text-warning-foreground">
                        Changes requested
                      </p>
                      <p className="mt-1">{m.revision_note}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {transactions.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No transactions yet.</p>
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-b py-2.5 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{formatNaira(t.amount_kobo)}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(t.created_at)}</p>
                    </div>
                    <StatusBadge status={t.type} tone={txTypeTone[t.type]} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Parties</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link href={`/users/${escrow.client.id}`} className="flex items-center gap-3 hover:underline">
                <Avatar>
                  <AvatarFallback>{initials(escrow.client.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{escrow.client.full_name}</p>
                  <p className="text-xs text-muted-foreground">Client · {escrow.client.email}</p>
                </div>
              </Link>
              <Link href={`/users/${escrow.freelancer.id}`} className="flex items-center gap-3 hover:underline">
                <Avatar>
                  <AvatarFallback>{initials(escrow.freelancer.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{escrow.freelancer.full_name}</p>
                  <p className="text-xs text-muted-foreground">Freelancer · {escrow.freelancer.email}</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="size-4" />
                <span className="capitalize">{escrow.payment_method} payment</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                <span>Deadline {formatDate(escrow.deadline_at)}</span>
              </div>
              {escrow.nomba_virtual_account_number ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="size-4" />
                  <span>
                    {escrow.nomba_virtual_bank_name} · {escrow.nomba_virtual_account_number}
                  </span>
                </div>
              ) : null}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(escrow.created_at)}</span>
              </div>
              {escrow.funded_at ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Funded</span>
                  <span>{formatDate(escrow.funded_at)}</span>
                </div>
              ) : null}
              {escrow.completed_at ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span>{formatDate(escrow.completed_at)}</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
