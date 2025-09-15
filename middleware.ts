import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") return NextResponse.next();
  return NextResponse.next();
}
