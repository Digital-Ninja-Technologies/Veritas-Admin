/**
 * These lead-intake routes are public by design (the marketing site posts
 * to them with no session/cookies involved), so a wide-open CORS policy
 * here carries the same trust level as the Formspree endpoint they used
 * before — it's a write-only intake surface, not something that leaks data.
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function corsJson(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: CORS_HEADERS });
}

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
