"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyToTicketAction } from "@/lib/data/support-actions";
import { formatDateTime, initials } from "@/lib/format";
import type { SupportMessage, SupportTicketStatus } from "@/lib/types";

export function TicketThread({
  ticketId,
  status,
  messages,
  userName,
}: {
  ticketId: string;
  status: SupportTicketStatus;
  messages: SupportMessage[];
  userName: string;
}) {
  const [reply, setReply] = useState("");
  const [pending, startTransition] = useTransition();

  function onReply() {
    startTransition(async () => {
      const result = await replyToTicketAction(ticketId, reply);
      if (result.ok) {
        toast.success("Reply sent");
        setReply("");
      } else {
        toast.error(result.error ?? "Failed to send reply");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {messages.map((m) => {
          const isAdmin = m.sender_role === "admin";
          return (
            <div key={m.id} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
              <Avatar className="size-8 shrink-0">
                <AvatarFallback>{isAdmin ? "VA" : initials(userName)}</AvatarFallback>
              </Avatar>
              <div className={`flex max-w-[80%] flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    isAdmin ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {m.body}
                </div>
                <p className="text-xs text-muted-foreground">{formatDateTime(m.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {status !== "closed" ? (
        <div className="flex flex-col gap-2 border-t pt-4">
          <Textarea
            placeholder="Write a reply…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
          />
          <Button onClick={onReply} disabled={pending || reply.trim().length === 0} className="self-end">
            {pending ? "Sending…" : "Send reply"}
          </Button>
        </div>
      ) : (
        <p className="border-t pt-4 text-sm text-muted-foreground">
          This ticket is closed. Reopen it from the status dropdown to reply.
        </p>
      )}
    </div>
  );
}
