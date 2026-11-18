import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { getDispute } from "@/lib/data/disputes";
import { formatNaira, formatDateTime, initials, titleCase } from "@/lib/format";
import { disputeStatusTone } from "@/lib/status-meta";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ResolveDisputeDialog } from "@/components/disputes/resolve-dispute-dialog";

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dispute = await getDispute(id);
  if (!dispute) notFound();

  const isResolved = dispute.status === "resolved";

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
        <Link href="/disputes">
          <ArrowLeft />
          Back to disputes
        </Link>
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{dispute.escrow.title}</h2>
            <StatusBadge status={dispute.status} tone={disputeStatusTone[dispute.status]} />
          </div>
          <Link href={`/escrows/${dispute.escrow.id}`} className="text-sm text-muted-foreground hover:underline">
            View escrow
          </Link>
        </div>
        {!isResolved ? (
          <ResolveDisputeDialog
            disputeId={dispute.id}
            amountKobo={dispute.escrow.amount_kobo}
            freelancerName={dispute.freelancer.full_name}
            clientName={dispute.client.full_name}
          />
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{dispute.reason}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Raised by {dispute.raised_by_user.full_name} on {formatDateTime(dispute.created_at)}
              </p>
            </CardContent>
          </Card>

          {isResolved ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-success-foreground" />
                  Resolution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm">
                  <span className="font-medium">{titleCase(dispute.resolution ?? "")}</span> —{" "}
                  {formatNaira(dispute.escrow.amount_kobo)} total
                </p>
                {dispute.admin_note ? (
                  <div className="rounded-md bg-muted/60 p-3 text-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Admin note
                    </p>
                    <p className="mt-1">{dispute.admin_note}</p>
                  </div>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  Resolved {dispute.resolved_at ? formatDateTime(dispute.resolved_at) : ""}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Parties</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href={`/users/${dispute.client.id}`} className="flex items-center gap-3 hover:underline">
              <Avatar>
                <AvatarFallback>{initials(dispute.client.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{dispute.client.full_name}</p>
                <p className="text-xs text-muted-foreground">Client · {dispute.client.email}</p>
              </div>
            </Link>
            <Link href={`/users/${dispute.freelancer.id}`} className="flex items-center gap-3 hover:underline">
              <Avatar>
                <AvatarFallback>{initials(dispute.freelancer.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{dispute.freelancer.full_name}</p>
                <p className="text-xs text-muted-foreground">Freelancer · {dispute.freelancer.email}</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
