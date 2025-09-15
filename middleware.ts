import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Exclude the root so the splash can render. Also skip static files and API.
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Leave "/" alone so the splash shows
  if (pathname === "/") return NextResponse.next();

  // If you had locale logic before, keep it here—but do NOT redirect "/"
  return NextResponse.next();
}
