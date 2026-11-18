import Link from "next/link";
import { LifeBuoy } from "lucide-react";

import { listSupportTickets } from "@/lib/data/support";
import { formatDateTime, titleCase } from "@/lib/format";
import { supportStatusTone } from "@/lib/status-meta";
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
import type { SupportTicketStatus } from "@/lib/types";

const SUPPORT_STATUSES: SupportTicketStatus[] = ["open", "pending", "closed"];

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const tickets = await listSupportTickets((status as SupportTicketStatus | undefined) ?? "all");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tickets.length} ticket{tickets.length === 1 ? "" : "s"}
        </p>
        <StatusFilter statuses={SUPPORT_STATUSES} />
      </div>

      {tickets.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="No support tickets" description="Try a different status filter." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      <Link href={`/support/${t.id}`} className="block hover:underline">
                        {t.subject}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{t.user.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{titleCase(t.category)}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} tone={supportStatusTone[t.status]} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(t.updated_at)}</TableCell>
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
