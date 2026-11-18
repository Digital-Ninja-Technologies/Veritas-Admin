"use client";

import { useState, useTransition, type ReactNode } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFaqAction, updateFaqAction } from "@/lib/data/faq-actions";
import { titleCase } from "@/lib/format";
import type { FaqEntry, SupportTicketCategory } from "@/lib/types";

const CATEGORIES: SupportTicketCategory[] = ["escrow", "payment", "account", "dispute", "other"];

export function FaqFormDialog({ faq, trigger }: { faq?: FaqEntry; trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<SupportTicketCategory>(faq?.category ?? "other");
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const input = { category, question, answer };
      const result = faq ? await updateFaqAction(faq.id, input) : await createFaqAction(input);
      if (result.ok) {
        toast.success(faq ? "FAQ updated" : "FAQ added");
        setOpen(false);
        if (!faq) {
          setCategory("other");
          setQuestion("");
          setAnswer("");
        }
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && faq) {
          setCategory(faq.category);
          setQuestion(faq.question);
          setAnswer(faq.answer);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          <DialogDescription>
            {faq ? "Update this question and answer." : "Add a new question and answer for users."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as SupportTicketCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {titleCase(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="faq-question">Question</Label>
            <Input
              id="faq-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How do I fund an escrow?"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="faq-answer">Answer</Label>
            <Textarea
              id="faq-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Write the answer…"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={pending || question.trim().length === 0 || answer.trim().length === 0}
          >
            {pending ? "Saving…" : faq ? "Save changes" : "Add FAQ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
