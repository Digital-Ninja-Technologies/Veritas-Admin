"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTicketStatusAction } from "@/lib/data/support-actions";
import { titleCase } from "@/lib/format";
import type { SupportTicketStatus } from "@/lib/types";

const STATUSES: SupportTicketStatus[] = ["open", "pending", "closed"];

export function UpdateStatusSelect({
  ticketId,
  status,
}: {
  ticketId: string;
  status: SupportTicketStatus;
}) {
  const [pending, startTransition] = useTransition();

  function onChange(value: string) {
    startTransition(async () => {
      const result = await updateTicketStatusAction(ticketId, value as SupportTicketStatus);
      if (result.ok) toast.success("Status updated");
      else toast.error(result.error ?? "Failed to update status");
    });
  }

  return (
    <Select value={status} onValueChange={onChange} disabled={pending}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {titleCase(s)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
