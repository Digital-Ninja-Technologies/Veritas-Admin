import Link from "next/link";
import { Users as UsersIcon } from "lucide-react";

import { listUsers } from "@/lib/data/users";
import { formatNaira, formatDate, initials } from "@/lib/format";
import { SearchBox } from "@/components/search-box";
import { EmptyState } from "@/components/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await listUsers(q);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{users.length} user{users.length === 1 ? "" : "s"}</p>
        <SearchBox placeholder="Search name or email…" />
      </div>

      {users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users found" description="Try a different search." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Wallet balance</TableHead>
                  <TableHead>Escrows</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      <Link href={`/users/${u.id}`} className="flex items-center gap-3 hover:underline">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">{initials(u.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{u.full_name}</p>
                          <p className="text-xs font-normal text-muted-foreground">{u.email}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.phone}</TableCell>
                    <TableCell>{formatNaira(u.wallet_balance_kobo)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.escrows_as_client} as client · {u.escrows_as_freelancer} as freelancer
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(u.created_at)}</TableCell>
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
