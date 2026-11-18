import { store } from "@/lib/mock/store";
import type { FaqEntry, SupportTicketCategory } from "@/lib/types";

export interface FaqInput {
  category: SupportTicketCategory;
  question: string;
  answer: string;
}

export async function listFaqs(category?: SupportTicketCategory | "all"): Promise<FaqEntry[]> {
  const matches =
    !category || category === "all" ? store.faqs : store.faqs.filter((f) => f.category === category);
  return [...matches].sort((a, b) => a.question.localeCompare(b.question));
}

export async function createFaq(
  input: FaqInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!input.question.trim() || !input.answer.trim()) {
    return { ok: false, error: "Question and answer are required" };
  }

  const id = `faq-${Date.now()}-${Math.round(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  store.faqs.push({
    id,
    category: input.category,
    question: input.question.trim(),
    answer: input.answer.trim(),
    created_at: now,
    updated_at: now,
  });

  return { ok: true, id };
}

export async function updateFaq(
  id: string,
  input: FaqInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const faq = store.faqs.find((f) => f.id === id);
  if (!faq) return { ok: false, error: "FAQ not found" };
  if (!input.question.trim() || !input.answer.trim()) {
    return { ok: false, error: "Question and answer are required" };
  }

  faq.category = input.category;
  faq.question = input.question.trim();
  faq.answer = input.answer.trim();
  faq.updated_at = new Date().toISOString();

  return { ok: true };
}

export async function deleteFaq(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const index = store.faqs.findIndex((f) => f.id === id);
  if (index === -1) return { ok: false, error: "FAQ not found" };

  store.faqs.splice(index, 1);
  return { ok: true };
}
