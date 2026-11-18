import { store } from "@/lib/mock/store";

export interface OverviewMetrics {
  totalEscrows: number;
  activeEscrows: number;
  fundedVolumeKobo: number;
  openDisputes: number;
  platformFeeRevenueKobo: number;
  totalUsers: number;
  statusBreakdown: { status: string; count: number }[];
  volumeByDay: { date: string; kobo: number }[];
}

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  const { escrows, disputes, transactions, users } = store;

  const activeStatuses = new Set(["funded", "active", "disputed"]);
  const activeEscrows = escrows.filter((e) => activeStatuses.has(e.status));

  const fundedVolumeKobo = escrows
    .filter((e) => e.funded_at)
    .reduce((sum, e) => sum + e.amount_kobo, 0);

  const platformFeeRevenueKobo = escrows
    .filter((e) => e.funded_at)
    .reduce((sum, e) => sum + e.platform_fee_kobo, 0);

  const statusCounts = new Map<string, number>();
  for (const e of escrows) statusCounts.set(e.status, (statusCounts.get(e.status) ?? 0) + 1);

  const byDay = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "deposit") continue;
    const day = t.created_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + t.amount_kobo);
  }
  const volumeByDay = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, kobo]) => ({ date, kobo }));

  return {
    totalEscrows: escrows.length,
    activeEscrows: activeEscrows.length,
    fundedVolumeKobo,
    openDisputes: disputes.filter((d) => d.status !== "resolved").length,
    platformFeeRevenueKobo,
    totalUsers: users.filter((u) => u.role === "user").length,
    statusBreakdown: [...statusCounts.entries()].map(([status, count]) => ({ status, count })),
    volumeByDay,
  };
}
