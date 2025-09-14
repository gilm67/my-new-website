'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UI as ui, type Locale } from '@/i18n/ui';

/* Locale helpers */
function localeFromPath(pathname: string): Locale {
  if (pathname.startsWith('/fr')) return 'fr';
  if (pathname.startsWith('/de')) return 'de';
  return 'en';
}
function withLocale(href: string, locale: Locale) {
  if (locale === 'en') return href || '/';
  return `/${locale}${href || ''}`;
}

export default function Footer() {
  const pathname = usePathname() || '/';
  const locale = localeFromPath(pathname);
  const t = ui[locale];
  const labels = locale === 'en' ? t.nav : (t.navShort ?? t.nav); // short labels for FR/DE

  return (
    <footer className="relative border-t border-white/10 bg-[#0B0E13]">
      {/* subtle top divider glow */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-500/70 via-sky-400/60 to-sky-500/70" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Column 1 – Markets */}
          <nav aria-label={t.footer.marketsWeServe}>
            <h3 className="text-sm font-semibold text-white">{t.footer.marketsWeServe}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-white/85">
              <li><Link className="hover:text-white" href={withLocale('/markets/geneva',    locale)}>Geneva</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/markets/zurich',    locale)}>Zürich</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/markets/dubai',     locale)}>Dubai</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/markets/singapore', locale)}>Singapore</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/markets/hong-kong', locale)}>Hong Kong</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/markets/london',    locale)}>London</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/markets/new-york',  locale)}>New York</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/markets/miami',     locale)}>Miami</Link></li>
            </ul>
            <div className="mt-3">
              <Link className="inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:text-sky-300"
                    href={withLocale('/markets', locale)}>
                {t.footer.viewAllMarkets}
              </Link>
            </div>
          </nav>

          {/* Column 2 – Company (uses short labels in FR/DE) */}
          <nav aria-label={t.footer.company} className="md:text-center">
            <h3 className="text-sm font-semibold text-white">{t.footer.company}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              <li><Link className="hover:text-white" href={withLocale('/jobs',            locale)}>{labels.jobs}</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/insights',        locale)}>{labels.insights}</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/hiring-managers', locale)}>Hiring Managers</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/about',           locale)}>{labels.about}</Link></li>
              <li><Link className="hover:text-white" href={withLocale('/contact',         locale)}>{labels.contact}</Link></li>
            </ul>
          </nav>

          {/* Column 3 – Brand (right side) */}
          <div className="md:text-right">
            <h3 className="text-sm font-extrabold text-white">{t.footer.executivePartners}</h3>
            <p className="mt-2 text-sm text-white/80">{t.footer.description}</p>
            <p className="mt-2 text-xs text-white/60">{t.footer.coverage}</p>
            <div className="mt-4">
              <a
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
                href="https://www.linkedin.com/company/executive-partners/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.footer.linkedin} →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/60 flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Executive Partners. All rights reserved.</span>
          <span>International &amp; Swiss Private Banking — HNW/UHNW</span>
        </div>
      </div>
    </footer>
  );
}
