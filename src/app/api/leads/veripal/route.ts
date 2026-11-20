import { createVeripalApplication } from "@/lib/data/leads";
import { corsJson, corsPreflight } from "@/lib/api/cors";

export async function OPTIONS() {
  return corsPreflight();
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
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

  const b = body as Record<string, unknown>;
  const result = await createVeripalApplication({
    name: str(b.name),
    email: str(b.email),
    country: str(b.country),
    platform: str(b.platform),
    audience_size: str(b.audience),
    profile_url: str(b.profile),
    audience_country: str(b.audience_country),
    niche: str(b.niche),
    why: str(b.why) || undefined,
  });

  if (!result.ok) return corsJson(result, 400);
  return corsJson(result, 201);
}
