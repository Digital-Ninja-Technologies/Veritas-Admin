import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getVeripalApplication } from "@/lib/data/leads";
import { formatDateTime, titleCase } from "@/lib/format";
import { veripalApplicationStatusTone } from "@/lib/status-meta";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VeripalStatusActions } from "@/components/leads/veripal-status-actions";

export default async function VeripalApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getVeripalApplication(id);
  if (!application) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" asChild className="w-fit -ml-2">
        <Link href="/leads">
          <ArrowLeft />
          Back to leads
        </Link>
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">{application.name}</h2>
          <StatusBadge status={application.status} tone={veripalApplicationStatusTone[application.status]} />
        </div>
        <VeripalStatusActions id={application.id} status={application.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Why they want in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {application.why || <span className="text-muted-foreground">No pitch provided.</span>}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <a href={`mailto:${application.email}`} className="hover:underline">
                {application.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Country</p>
              <p>{application.country}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Main platform</p>
              <p>{application.platform}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Audience size</p>
              <p>{application.audience_size}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Audience location</p>
              <p>{application.audience_country}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Niche</p>
              <p>{titleCase(application.niche)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Profile{application.profile_url.includes(",") ? "s" : ""}</p>
              {application.profile_url ? (
                <div className="flex flex-col gap-1">
                  {application.profile_url
                    .split(",")
                    .map((url) => url.trim())
                    .filter(Boolean)
                    .map((url) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer" className="break-all hover:underline">
                        {url}
                      </a>
                    ))}
                </div>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Applied</p>
              <p>{formatDateTime(application.created_at)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
