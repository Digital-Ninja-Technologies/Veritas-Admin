import Link from "next/link";
import { Receipt } from "lucide-react";

import { listTransactions, TX_TYPES } from "@/lib/data/transactions";
import { formatNaira, formatDateTime, titleCase } from "@/lib/format";
import { txTypeTone } from "@/lib/status-meta";
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
import type { TxType } from "@/lib/types";

const CREDIT_TYPES: TxType[] = ["deposit", "release", "wallet_topup"];

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const transactions = await listTransactions((type as TxType | undefined) ?? "all");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {transactions.length} transaction{transactions.length === 1 ? "" : "s"}
        </p>
        <StatusFilter statuses={TX_TYPES} paramName="type" />
      </div>

      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions found" description="Try a different type filter." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Escrow / counterparty</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <StatusBadge status={t.type} tone={txTypeTone[t.type]} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {t.escrow_id ? (
                        <Link href={`/escrows/${t.escrow_id}`} className="hover:underline">
                          {t.escrow_title ?? "View escrow"}
                        </Link>
                      ) : t.counterparty ? (
                        <Link href={`/users/${t.counterparty.id}`} className="hover:underline">
                          {t.counterparty.full_name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell
                      className={CREDIT_TYPES.includes(t.type) ? "text-success-foreground" : "text-foreground"}
                    >
                      {CREDIT_TYPES.includes(t.type) ? "+" : "−"}
                      {formatNaira(t.amount_kobo)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {t.nomba_tx_ref ?? titleCase(t.id)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(t.created_at)}</TableCell>
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
