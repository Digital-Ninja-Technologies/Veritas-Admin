"use server";

import { revalidatePath } from "next/cache";
import { createFaq, deleteFaq, updateFaq, type FaqInput } from "@/lib/data/faq";

export async function createFaqAction(
  input: FaqInput,
): Promise<{ ok: boolean; error?: string }> {
  const result = await createFaq(input);
  if (result.ok) {
    revalidatePath("/support");
    return { ok: true };
  }
  return { ok: false, error: result.error };
}

export async function updateFaqAction(
  id: string,
  input: FaqInput,
): Promise<{ ok: boolean; error?: string }> {
  const result = await updateFaq(id, input);
  if (result.ok) {
    revalidatePath("/support");
    return { ok: true };
  }
  return { ok: false, error: result.error };
}

export async function deleteFaqAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const result = await deleteFaq(id);
  if (result.ok) {
    revalidatePath("/support");
    return { ok: true };
  }
  return { ok: false, error: result.error };
}
