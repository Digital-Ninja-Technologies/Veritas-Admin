"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import { MOCK_ADMIN } from "@/lib/auth/constants";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (email !== MOCK_ADMIN.email || password !== MOCK_ADMIN.password) {
    return { error: "Invalid email or password." };
  }

  await createSession();
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
