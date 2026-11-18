"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolveDisputeAction } from "@/lib/data/disputes-actions";
import { formatNaira } from "@/lib/format";
import type { DisputeResolution } from "@/lib/types";

const RESOLUTIONS: { value: DisputeResolution; label: string; description: string }[] = [
  { value: "release_to_seller", label: "Release to freelancer", description: "Pays the full amount to the freelancer and completes the escrow." },
  { value: "refund_to_buyer", label: "Refund to client", description: "Pays the full amount back to the client and refunds the escrow." },
  { value: "split", label: "Split 50/50", description: "Pays half to the freelancer and half back to the client." },
];

export function ResolveDisputeDialog({
  disputeId,
  amountKobo,
  freelancerName,
  clientName,
}: {
  disputeId: string;
  amountKobo: number;
  freelancerName: string;
  clientName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [resolution, setResolution] = useState<DisputeResolution>("release_to_seller");
  const [adminNote, setAdminNote] = useState("");
  const [pending, startTransition] = useTransition();

  const selected = RESOLUTIONS.find((r) => r.value === resolution)!;
  const half = Math.floor(amountKobo / 2);

  function onSubmit() {
    startTransition(async () => {
      const result = await resolveDisputeAction(disputeId, resolution, adminNote.trim());
      if (result.ok) {
        toast.success("Dispute resolved");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to resolve dispute");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Resolve dispute</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve dispute</DialogTitle>
          <DialogDescription>
            This pays out from escrow immediately and can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Resolution</Label>
            <Select value={resolution} onValueChange={(v) => setResolution(v as DisputeResolution)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{selected.description}</p>
          </div>

          <div className="rounded-md bg-muted/60 p-3 text-sm">
            {resolution === "release_to_seller" && (
              <p>
                {freelancerName} receives <span className="font-medium">{formatNaira(amountKobo)}</span>.
              </p>
            )}
            {resolution === "refund_to_buyer" && (
              <p>
                {clientName} is refunded <span className="font-medium">{formatNaira(amountKobo)}</span>.
              </p>
            )}
            {resolution === "split" && (
              <p>
                {freelancerName} receives <span className="font-medium">{formatNaira(half)}</span>, {clientName}{" "}
                is refunded <span className="font-medium">{formatNaira(amountKobo - half)}</span>.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-note">Admin note</Label>
            <Textarea
              id="admin-note"
              placeholder="Explain the reasoning behind this resolution…"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={pending || adminNote.trim().length === 0}>
            {pending ? "Resolving…" : "Confirm resolution"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
