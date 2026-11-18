import Link from "next/link";
import { Gavel } from "lucide-react";

import { listDisputes } from "@/lib/data/disputes";
import { formatNaira, formatDate } from "@/lib/format";
import { disputeStatusTone } from "@/lib/status-meta";
import { StatusBadge } from "@/components/status-badge";
import { StatusFilter } from "@/components/status-filter";
import { EmptyState } from "@/components/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { DisputeStatus } from "@/lib/types";

const DISPUTE_STATUSES: DisputeStatus[] = ["open", "reviewing", "resolved"];

export default async function DisputesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const disputes = await listDisputes((status as DisputeStatus | undefined) ?? "all");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {disputes.length} dispute{disputes.length === 1 ? "" : "s"}
        </p>
        <StatusFilter statuses={DISPUTE_STATUSES} />
      </div>

      {disputes.length === 0 ? (
        <EmptyState icon={Gavel} title="No disputes found" description="Try a different status filter." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escrow</TableHead>
                  <TableHead>Raised by</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Opened</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">
                      <Link href={`/disputes/${d.id}`} className="block hover:underline">
                        {d.escrow.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{d.raised_by_user.full_name}</TableCell>
                    <TableCell>{formatNaira(d.escrow.amount_kobo)}</TableCell>
                    <TableCell>
                      <StatusBadge status={d.status} tone={disputeStatusTone[d.status]} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(d.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
