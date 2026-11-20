"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateVeripalApplicationStatusAction } from "@/lib/data/leads-actions";
import type { VeripalApplicationStatus } from "@/lib/types";

export function VeripalStatusActions({ id, status }: { id: string; status: VeripalApplicationStatus }) {
  const [pending, startTransition] = useTransition();

  function onUpdate(next: VeripalApplicationStatus) {
    startTransition(async () => {
      const result = await updateVeripalApplicationStatusAction(id, next);
      if (result.ok) toast.success(next === "approved" ? "Application approved" : "Application rejected");
      else toast.error(result.error ?? "Failed to update application");
    });
  }

  if (status !== "new") {
    return (
      <Button variant="outline" size="sm" onClick={() => onUpdate("new")} disabled={pending}>
        Reopen
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onUpdate("rejected")} disabled={pending}>
        Reject
      </Button>
      <Button size="sm" onClick={() => onUpdate("approved")} disabled={pending}>
        Approve
      </Button>
    </div>
  );
}
