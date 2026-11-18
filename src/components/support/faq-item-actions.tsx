"use client";

import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteFaqAction } from "@/lib/data/faq-actions";
import { FaqFormDialog } from "@/components/support/faq-form-dialog";
import type { FaqEntry } from "@/lib/types";

export function FaqItemActions({ faq }: { faq: FaqEntry }) {
  const [pending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      const result = await deleteFaqAction(faq.id);
      if (result.ok) toast.success("FAQ deleted");
      else toast.error(result.error ?? "Failed to delete FAQ");
    });
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <FaqFormDialog
        faq={faq}
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label="Edit FAQ">
            <Pencil />
          </Button>
        }
      />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete FAQ"
        disabled={pending}
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
