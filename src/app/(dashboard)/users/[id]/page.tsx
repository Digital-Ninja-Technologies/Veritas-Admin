import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileStack, Mail, Phone, Wallet as WalletIcon } from "lucide-react";

import { getUser } from "@/lib/data/users";
import { listEscrowsForUser } from "@/lib/data/escrows";
import { formatNaira, formatDate, initials } from "@/lib/format";
import { escrowStatusTone } from "@/lib/status-meta";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, escrows] = await Promise.all([getUser(id), listEscrowsForUser(id)]);
  if (!user) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
        <Link href="/users">
          <ArrowLeft />
          Back to users
        </Link>
      </Button>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">{initials(user.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">Joined {formatDate(user.created_at)}</p>
            </div>
            <div className="flex w-full flex-col gap-2 pt-2 text-left text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4" />
                {user.phone}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <WalletIcon className="size-4" />
              Wallet balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNaira(user.wallet_balance_kobo)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Escrows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{escrows.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {user.escrows_as_client} as client · {user.escrows_as_freelancer} as freelancer
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escrows</CardTitle>
        </CardHeader>
        <CardContent>
          {escrows.length === 0 ? (
            <EmptyState icon={FileStack} title="No escrows yet" description="This user hasn't been part of an escrow." />
          ) : (
            <div className="flex flex-col">
              {escrows.map((e, i) => {
                const role = e.client_id === id ? "Client" : "Freelancer";
                const counterparty = e.client_id === id ? e.freelancer : e.client;
                return (
                  <Link
                    key={e.id}
                    href={`/escrows/${e.id}`}
                    className={`flex items-center justify-between gap-3 py-3 hover:bg-muted/50 -mx-2 px-2 rounded-md ${i > 0 ? "border-t" : ""}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {role} · with {counterparty.full_name}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-medium">{formatNaira(e.amount_kobo)}</span>
                      <StatusBadge status={e.status} tone={escrowStatusTone[e.status]} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
