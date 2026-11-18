import { escrowStatusTone } from "@/lib/status-meta";
import type { EscrowStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

export function StatusBreakdown({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((d) => (
        <div key={d.status} className="flex items-center gap-3">
          <StatusBadge status={d.status} tone={escrowStatusTone[d.status as EscrowStatus]} />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(d.count / total) * 100}%` }}
            />
          </div>
          <span className="w-6 text-right text-sm font-medium text-muted-foreground">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
