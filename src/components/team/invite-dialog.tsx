"use client";

import { useState, useTransition } from "react";
import { Copy, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInviteAction } from "@/lib/data/team-actions";

export function InviteDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const result = await createInviteAction(email);
      if (result.ok && result.token) {
        setInviteLink(`${window.location.origin}/invite/${result.token}`);
        toast.success("Invite created");
      } else {
        toast.error(result.error ?? "Failed to create invite");
      }
    });
  }

  function onCopy() {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Link copied");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setEmail("");
          setInviteLink(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Invite customer care
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite customer care</DialogTitle>
          <DialogDescription>
            {inviteLink
              ? "Share this link with them to set up their account."
              : "They'll use this link to create their account and pick an avatar."}
          </DialogDescription>
        </DialogHeader>

        {inviteLink ? (
          <div className="flex items-center gap-2">
            <Input readOnly value={inviteLink} />
            <Button type="button" variant="outline" size="icon" onClick={onCopy} aria-label="Copy link">
              <Copy />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoFocus
            />
          </div>
        )}

        <DialogFooter>
          {inviteLink ? (
            <Button onClick={() => setOpen(false)}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button onClick={onSubmit} disabled={pending || email.trim().length === 0}>
                {pending ? "Sending…" : "Send invite"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
