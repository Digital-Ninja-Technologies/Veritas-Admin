import { createContactMessage } from "@/lib/data/leads";
import { corsJson, corsPreflight } from "@/lib/api/cors";

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return corsJson({ ok: false, error: "Invalid JSON body" }, 400);
  }

  if (typeof body !== "object" || body === null) {
    return corsJson({ ok: false, error: "Invalid request body" }, 400);
  }

  const { name, email, message } = body as Record<string, unknown>;
  const result = await createContactMessage({
    name: typeof name === "string" ? name : "",
    email: typeof email === "string" ? email : "",
    message: typeof message === "string" ? message : "",
  });

  if (!result.ok) return corsJson(result, 400);
  return corsJson(result, 201);
}
