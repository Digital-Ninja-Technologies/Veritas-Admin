"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { markContactMessageReadAction } from "@/lib/data/leads-actions";

export function MarkReadButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const result = await markContactMessageReadAction(id);
      if (!result.ok) toast.error(result.error ?? "Failed to update message");
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={onClick} disabled={pending}>
      Mark read
    </Button>
  );
}
