'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UI as ui, type Locale } from '@/i18n/ui';
import { useMemo, Suspense } from 'react';
import LangSwitch from '@/site/components/LangSwitch';

/* --------- Routes (keys map to i18n labels) --------- */
const NAV = [
  { key: 'home',            href: '' },
  { key: 'markets',         href: '/markets' },
  { key: 'jobs',            href: '/jobs' },
  { key: 'hiringManagers',  href: '/hiring-managers' }, // ✅ added
  { key: 'simulator',       href: '/bp-simulator/portability' }, // ✅ correct path
  { key: 'portability',     href: '/portability-score' },
  { key: 'insights',        href: '/insights' },
  { key: 'about',           href: '/about' },
  { key: 'contact',         href: '/contact' },
] as const;

/* --------- Locale helpers --------- */
function useLocale(): Locale {
  const path = usePathname() || '/en';
  if (path.startsWith('/fr')) return 'fr';
  if (path.startsWith('/de')) return 'de';
  return 'en';
}

/** Locale-aware link builder. Keeps you inside current locale tree. */
function L(href: string, locale: Locale, pathname: string) {
  if (locale === 'en') return href || '/';
  if (pathname.startsWith(`/${locale}`)) {
    return href ? `/${locale}${href}` : `/${locale}`;
  }
  return href ? `/${locale}${href}` : `/${locale}`;
}

function NavLink({
  href,
  label,
  active,
  title,
}: {
  href: string;
  label: string;
  active?: boolean;
  title?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        // spacing + layout
        'px-2 py-2 whitespace-nowrap transition',
        // make brighter, bold, slightly bigger
        'text-[14px] md:text-[15px] font-bold tracking-tight',
        // colors
        active ? 'text-white' : 'text-white/90 hover:text-white',
      ].join(' ')}
      title={title ?? label}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname() || '/';
  const locale = useLocale();

  // Shorter labels in FR/DE to preserve one-line layout
  const t = useMemo(() => {
    const base = ui[locale];
    return base.navShort ?? base.nav;
  }, [locale]);

  const isActive = (href: string) => {
    const full = L(href, locale, pathname);
    // active when exact match or current path starts with it (except home)
    if (href === '') return pathname === '/' || pathname === `/${locale}`;
    return pathname === full || pathname.startsWith(full + '/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0E13]/90 backdrop-blur">
      <div className="ep-container flex h-14 items-center justify-between">
        {/* Brand */}
        <Link href={L('/', locale, pathname)} className="text-base font-extrabold tracking-tight">
          Executive Partners
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.key}
              href={L(item.href, locale, pathname)}
              label={(t as any)[item.key] ?? item.key} // keys exist in UI; fallback avoids crash
              active={isActive(item.href)}
            />
          ))}
        </nav>

        {/* Lang switch (wrapped to satisfy useSearchParams SSR rule) */}
        <div className="flex items-center gap-2">
          <Suspense fallback={null}>
            <LangSwitch />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
