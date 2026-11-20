import Link from "next/link";
import { Inbox, Megaphone } from "lucide-react";

import { listContactMessages, listVeripalApplications } from "@/lib/data/leads";
import { formatDateTime, titleCase } from "@/lib/format";
import { contactMessageStatusTone, veripalApplicationStatusTone } from "@/lib/status-meta";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { MarkReadButton } from "@/components/leads/mark-read-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function LeadsPage() {
  const [messages, applications] = await Promise.all([listContactMessages(), listVeripalApplications()]);

  return (
    <Tabs defaultValue="contact" className="gap-4">
      <TabsList className="w-fit">
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="veripals">Veripals</TabsTrigger>
      </TabsList>

      <TabsContent value="contact" className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {messages.length} message{messages.length === 1 ? "" : "s"} from the Contact form
        </p>

        {messages.length === 0 ? (
          <EmptyState icon={Inbox} title="No messages yet" description="Contact form submissions show up here." />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y">
                {messages.map((m) => (
                  <div key={m.id} className="flex items-start justify-between gap-3 p-4">
                    <details className="min-w-0 flex-1">
                      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2">
                        <span className="font-medium">{m.name}</span>
                        <span className="text-sm text-muted-foreground">{m.email}</span>
                        <StatusBadge status={m.status} tone={contactMessageStatusTone[m.status]} />
                        <span className="ml-auto text-xs text-muted-foreground">{formatDateTime(m.created_at)}</span>
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.message}</p>
                    </details>
                    {m.status === "new" ? <MarkReadButton id={m.id} /> : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="veripals" className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {applications.length} application{applications.length === 1 ? "" : "s"} from the Veripals form
        </p>

        {applications.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No applications yet"
            description="Veripals creator-program applications show up here."
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Niche</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">
                        <Link href={`/leads/veripals/${a.id}`} className="block hover:underline">
                          {a.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{a.platform}</TableCell>
                      <TableCell className="text-muted-foreground">{a.audience_size}</TableCell>
                      <TableCell className="text-muted-foreground">{titleCase(a.niche)}</TableCell>
                      <TableCell>
                        <StatusBadge status={a.status} tone={veripalApplicationStatusTone[a.status]} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDateTime(a.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
