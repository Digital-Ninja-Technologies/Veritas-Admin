"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { setStaffActiveAction } from "@/lib/data/team-actions";

export function StaffStatusToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition();

  function onToggle() {
    startTransition(async () => {
      const result = await setStaffActiveAction(id, !isActive);
      if (result.ok) toast.success(isActive ? "Account suspended" : "Account reactivated");
      else toast.error(result.error ?? "Failed to update status");
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={onToggle} disabled={pending}>
      {isActive ? "Suspend" : "Reactivate"}
    </Button>
  );
}
