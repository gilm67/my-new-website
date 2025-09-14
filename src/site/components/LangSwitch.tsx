// src/site/components/LangSwitch.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type Locale } from '@/i18n/ui';

const SUPPORTED: Locale[] = ['en', 'fr', 'de'];

function detectLocale(path: string): Locale {
  if (path.startsWith('/fr')) return 'fr';
  if (path.startsWith('/de')) return 'de';
  return 'en';
}

/**
 * Build a URL for the chosen locale while preserving the current path and query string.
 * - For EN (default), no /en prefix at the root.
 * - For FR/DE, prefix with /fr or /de.
 */
function localizePath(pathname: string, target: Locale, qs: string) {
  const current = detectLocale(pathname);
  // strip current locale segment (if any)
  let rest = pathname;
  if (current !== 'en' && rest.startsWith(`/${current}`)) {
    rest = rest.slice(current.length + 1) || '/';
  }
  // construct target path
  let base =
    target === 'en'
      ? rest || '/'
      : `/${target}${rest === '/' ? '' : rest}`;

  if (qs) base += `?${qs}`;
  return base;
}

export default function LangSwitch() {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const qs = searchParams?.toString() || '';
  const current = detectLocale(pathname);

  return (
    <nav aria-label="Language switcher" className="flex items-center gap-1">
      {SUPPORTED.map((loc) => {
        const href = localizePath(pathname, loc, qs);
        const active = loc === current;
        const label = loc.toUpperCase();

        return (
          <Link
            key={loc}
            href={href}
            hrefLang={loc}
            aria-current={active ? 'page' : undefined}
            className={[
              'rounded-full px-2.5 py-1 text-xs font-semibold transition',
              active
                ? 'bg-white/15 text-white'
                : 'border border-white/15 bg-white/5 text-white/85 hover:bg-white/10',
            ].join(' ')}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
