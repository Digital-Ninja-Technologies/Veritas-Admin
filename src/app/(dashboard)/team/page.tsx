import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";
import { listInvites, listStaff } from "@/lib/data/team";
import { avatarUrl } from "@/lib/avatars";
import { formatDate, initials } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InviteDialog } from "@/components/team/invite-dialog";
import { StaffStatusToggle } from "@/components/team/staff-status-toggle";
import { RevokeInviteButton } from "@/components/team/revoke-invite-button";

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/support");

  const [staff, invites] = await Promise.all([listStaff(), listInvites("pending")]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {staff.length} team member{staff.length === 1 ? "" : "s"}
        </p>
        <InviteDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        {s.avatar_seed ? <AvatarImage src={avatarUrl(s.avatar_seed)} alt="" /> : null}
                        <AvatarFallback>{initials(s.full_name)}</AvatarFallback>
                      </Avatar>
                      {s.full_name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.email}</TableCell>
                  <TableCell>
                    <Badge variant={s.role === "admin" ? "secondary" : "info"}>
                      {s.role === "admin" ? "Super Admin" : "Customer Care"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.is_active === false ? "destructive" : "success"}>
                      {s.is_active === false ? "Suspended" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {s.role === "customer_care" ? (
                      <StaffStatusToggle id={s.id} isActive={s.is_active !== false} />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {invites.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Pending invites</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.email}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(i.created_at)}</TableCell>
                    <TableCell>
                      <RevokeInviteButton id={i.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
