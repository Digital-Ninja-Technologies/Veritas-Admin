import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getSupportTicket } from "@/lib/data/support";
import { formatDateTime, titleCase } from "@/lib/format";
import { supportStatusTone } from "@/lib/status-meta";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketThread } from "@/components/support/ticket-thread";
import { UpdateStatusSelect } from "@/components/support/update-status-select";

export default async function SupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getSupportTicket(id);
  if (!ticket) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
        <Link href="/support">
          <ArrowLeft />
          Back to support
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold tracking-tight">{ticket.subject}</h2>
        <StatusBadge status={ticket.status} tone={supportStatusTone[ticket.status]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketThread
              ticketId={ticket.id}
              status={ticket.status}
              messages={ticket.messages}
              userName={ticket.user.full_name}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Submitted by</p>
                <Link href={`/users/${ticket.user.id}`} className="font-medium hover:underline">
                  {ticket.user.full_name}
                </Link>
                <p className="text-xs text-muted-foreground">{ticket.user.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Category</p>
                <p>{titleCase(ticket.category)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Opened</p>
                <p>{formatDateTime(ticket.created_at)}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                <UpdateStatusSelect ticketId={ticket.id} status={ticket.status} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
