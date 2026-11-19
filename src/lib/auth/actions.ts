"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import { MOCK_ADMIN } from "@/lib/auth/constants";
import { store } from "@/lib/mock/store";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
    await createSession("usr-admin", "admin");
    redirect("/");
  }

  const user = store.users.find(
    (u) => u.email.toLowerCase() === email && (u.role === "admin" || u.role === "customer_care"),
  );
  const credential = user ? store.staffCredentials.find((c) => c.user_id === user.id) : undefined;

  if (!user || !credential || credential.password !== password) {
    return { error: "Invalid email or password." };
  }
  if (user.is_active === false) {
    return { error: "This account has been suspended. Contact a super admin." };
  }

  await createSession(user.id, user.role);
  redirect(user.role === "customer_care" ? "/support" : "/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
