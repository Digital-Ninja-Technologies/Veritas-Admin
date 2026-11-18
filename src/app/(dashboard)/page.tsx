import Link from "next/link";
import { FileStack, Gavel, TrendingUp, Wallet } from "lucide-react";

import { getOverviewMetrics } from "@/lib/data/metrics";
import { listTransactions } from "@/lib/data/transactions";
import { listDisputes } from "@/lib/data/disputes";
import { formatNairaCompact, formatDate, titleCase } from "@/lib/format";
import { StatCard } from "@/components/stat-card";
import { VolumeChart } from "@/components/overview/volume-chart";
import { StatusBreakdown } from "@/components/overview/status-breakdown";
import { StatusBadge } from "@/components/status-badge";
import { disputeStatusTone, txTypeTone } from "@/lib/status-meta";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function OverviewPage() {
  const [metrics, recentTx, openDisputes] = await Promise.all([
    getOverviewMetrics(),
    listTransactions(),
    listDisputes("open"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Funded volume"
          value={formatNairaCompact(metrics.fundedVolumeKobo)}
          sub={`${metrics.totalEscrows} total escrows`}
          icon={Wallet}
        />
        <StatCard
          label="Active escrows"
          value={String(metrics.activeEscrows)}
          sub="Funded, active, or disputed"
          icon={FileStack}
        />
        <StatCard
          label="Open disputes"
          value={String(metrics.openDisputes)}
          sub="Awaiting resolution"
          icon={Gavel}
        />
        <StatCard
          label="Platform fee revenue"
          value={formatNairaCompact(metrics.platformFeeRevenueKobo)}
          sub={`${metrics.totalUsers} registered users`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Funded volume</CardTitle>
            <CardDescription>Naira deposited into escrow, by day.</CardDescription>
          </CardHeader>
          <CardContent>
            <VolumeChart data={metrics.volumeByDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escrows by status</CardTitle>
            <CardDescription>Across the full lifecycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusBreakdown data={metrics.statusBreakdown} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest ledger transactions.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/transactions">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {recentTx.slice(0, 6).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-3 border-b py-2.5 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{tx.escrow_title ?? titleCase(tx.type)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                </div>
                <StatusBadge status={tx.type} tone={txTypeTone[tx.type]} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Needs attention</CardTitle>
              <CardDescription>Disputes still open.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/disputes">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {openDisputes.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No open disputes.</p>
            ) : (
              openDisputes.slice(0, 6).map((d) => (
                <Link
                  key={d.id}
                  href={`/disputes/${d.id}`}
                  className="flex items-center justify-between gap-3 border-b py-2.5 last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded-md"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.escrow.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      Raised by {d.raised_by_user.full_name}
                    </p>
                  </div>
                  <StatusBadge status={d.status} tone={disputeStatusTone[d.status]} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
