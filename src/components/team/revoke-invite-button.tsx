"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { revokeInviteAction } from "@/lib/data/team-actions";

export function RevokeInviteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function onRevoke() {
    startTransition(async () => {
      const result = await revokeInviteAction(id);
      if (result.ok) toast.success("Invite revoked");
      else toast.error(result.error ?? "Failed to revoke invite");
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={onRevoke} disabled={pending}>
      Revoke
    </Button>
  );
}
