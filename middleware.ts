// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['en', 'fr', 'de'] as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals / API / static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Redirect root to the default locale once
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  // If path already has a supported locale prefix, do nothing
  if (new RegExp(`^/(?:${LOCALES.join('|')})(/|$)`).test(pathname)) {
    return NextResponse.next();
  }

  // Otherwise, just continue (no forced rewrites)
  return NextResponse.next();
}

// Tip: remove the old matcher that limited to ['/fr', '/de']
// If you keep a matcher, this one is safe:
// export const config = { matcher: ['/', '/(en|fr|de)/:path*'] };
