import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "veritas_admin_session";
const PUBLIC_PATHS = ["/login", "/invite"];

interface SessionData {
  userId: string;
  role: string;
}

function parseSession(value: string | undefined): SessionData | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as SessionData;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = session.role === "customer_care" ? "/support" : "/";
    return NextResponse.redirect(url);
  }

  // Customer care only gets the Support section — everything else (escrows,
  // disputes, financial data, team management) is super-admin only.
  if (session?.role === "customer_care" && !pathname.startsWith("/support")) {
    const url = request.nextUrl.clone();
    url.pathname = "/support";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // /api is excluded: it's the public lead-intake surface the marketing site
  // posts to, and must stay reachable without a session or a redirect to
  // /login getting in the way of a JSON POST.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
