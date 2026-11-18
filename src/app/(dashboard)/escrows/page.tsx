import Link from "next/link";
import { listEscrows, ESCROW_STATUSES } from "@/lib/data/escrows";
import { formatNaira, formatDate } from "@/lib/format";
import { escrowStatusTone } from "@/lib/status-meta";
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
import { FileStack } from "lucide-react";
import type { EscrowStatus } from "@/lib/types";

export default async function EscrowsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const escrows = await listEscrows((status as EscrowStatus | undefined) ?? "all");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{escrows.length} escrow{escrows.length === 1 ? "" : "s"}</p>
        <StatusFilter statuses={ESCROW_STATUSES} />
      </div>

      {escrows.length === 0 ? (
        <EmptyState icon={FileStack} title="No escrows found" description="Try a different status filter." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Freelancer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escrows.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">
                      <Link href={`/escrows/${e.id}`} className="block hover:underline">
                        {e.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{e.client.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{e.freelancer.full_name}</TableCell>
                    <TableCell>{formatNaira(e.amount_kobo)}</TableCell>
                    <TableCell>
                      <StatusBadge status={e.status} tone={escrowStatusTone[e.status]} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(e.created_at)}</TableCell>
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
