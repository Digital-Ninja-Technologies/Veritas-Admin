import { store } from "@/lib/mock/store";
import type {
  ContactMessage,
  ContactMessageStatus,
  VeripalApplication,
  VeripalApplicationStatus,
} from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function listContactMessages(
  status?: ContactMessageStatus | "all",
): Promise<ContactMessage[]> {
  const matches =
    !status || status === "all" ? store.contactMessages : store.contactMessages.filter((m) => m.status === status);
  return [...matches].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export async function createContactMessage(
  input: ContactMessageInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";
  const message = input.message?.trim() ?? "";

  if (!name) return { ok: false, error: "Name is required" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "A valid email is required" };
  if (!message) return { ok: false, error: "Message is required" };

  const id = `cmsg-${Date.now()}-${Math.round(Math.random() * 1000)}`;
  store.contactMessages.unshift({
    id,
    name,
    email,
    message,
    status: "new",
    created_at: new Date().toISOString(),
  });

  return { ok: true, id };
}

export async function markContactMessageRead(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const message = store.contactMessages.find((m) => m.id === id);
  if (!message) return { ok: false, error: "Message not found" };

  message.status = "read";
  return { ok: true };
}

export async function listVeripalApplications(
  status?: VeripalApplicationStatus | "all",
): Promise<VeripalApplication[]> {
  const matches =
    !status || status === "all"
      ? store.veripalApplications
      : store.veripalApplications.filter((a) => a.status === status);
  return [...matches].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getVeripalApplication(id: string): Promise<VeripalApplication | undefined> {
  return store.veripalApplications.find((a) => a.id === id);
}

export interface VeripalApplicationInput {
  name: string;
  email: string;
  country: string;
  platform: string;
  audience_size: string;
  profile_url: string;
  audience_country: string;
  niche: string;
  why?: string;
}

export async function createVeripalApplication(
  input: VeripalApplicationInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";

  if (!name) return { ok: false, error: "Name is required" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "A valid email is required" };
  if (!input.platform?.trim()) return { ok: false, error: "Platform is required" };
  if (!input.audience_size?.trim()) return { ok: false, error: "Audience size is required" };
  if (!input.niche?.trim()) return { ok: false, error: "Niche is required" };

  const id = `vpal-${Date.now()}-${Math.round(Math.random() * 1000)}`;
  store.veripalApplications.unshift({
    id,
    name,
    email,
    country: input.country?.trim() ?? "",
    platform: input.platform.trim(),
    audience_size: input.audience_size.trim(),
    profile_url: input.profile_url?.trim() ?? "",
    audience_country: input.audience_country?.trim() ?? "",
    niche: input.niche.trim(),
    why: input.why?.trim() || undefined,
    status: "new",
    created_at: new Date().toISOString(),
  });

  return { ok: true, id };
}

export async function updateVeripalApplicationStatus(
  id: string,
  status: VeripalApplicationStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const application = store.veripalApplications.find((a) => a.id === id);
  if (!application) return { ok: false, error: "Application not found" };

  application.status = status;
  return { ok: true };
}
