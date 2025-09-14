// src/site/pages/HiringManagersContent.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONTENT } from '@/i18n/content';

type Locale = 'en' | 'fr' | 'de';

function localeFromPath(path: string): Locale {
  if (path.startsWith('/fr')) return 'fr';
  if (path.startsWith('/de')) return 'de';
  return 'en';
}

/** Locale-aware link builder. Keeps you inside the current locale tree. */
function L(href: string, locale: Locale) {
  return locale === 'en' ? (href || '/') : `/${locale}${href || ''}`;
}

export default function HiringManagersContent() {
  const pathname = usePathname() || '/';
  const locale: Locale = localeFromPath(pathname);
  const dict = CONTENT[locale]?.hiringManagers ?? CONTENT.en.hiringManagers;

  const badge =
    dict.badge ??
    (locale === 'fr'
      ? 'Pour les recruteurs'
      : locale === 'de'
      ? 'Für Hiring Manager'
      : 'For Hiring Managers');

  return (
    <div className="page-glow">
      <header className="text-center">
        <span className="ep-chip">{badge}</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
          {dict.title}
        </h1>
        {dict.intro ? (
          <p className="mx-auto mt-4 max-w-3xl text-neutral-300">{dict.intro}</p>
        ) : null}
      </header>

      {Array.isArray(dict.bullets) && dict.bullets.length > 0 && (
        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {dict.bullets.map((b, i) => (
            <li key={i} className="ep-card flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {Array.isArray(dict.sections) && dict.sections.length > 0 ? (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {dict.sections.map((s, i) => (
            <article key={i} className="ep-card">
              <h3 className="text-xl font-semibold">{s.title}</h3>
              {s.body ? <p className="mt-2 text-neutral-300">{s.body}</p> : null}
            </article>
          ))}
        </section>
      ) : null}

      {/* CTA block — extra bottom space before the blue divider */}
      <div className="mx-auto mt-10 mb-16 flex max-w-3xl justify-center gap-3">
        <Link href={L('/hiring-managers', locale)} className="btn btn-primary">
          {dict.ctas?.primary ?? (locale === 'fr'
            ? 'Demander une shortlist'
            : locale === 'de'
            ? 'Shortlist anfordern'
            : 'Request a shortlist')}
        </Link>
        <Link href={L('/contact', locale)} className="btn btn-outline">
          {dict.ctas?.secondary ?? (locale === 'fr'
            ? 'Parler avec nous'
            : locale === 'de'
            ? 'Mit uns sprechen'
            : 'Talk to us')}
        </Link>
      </div>

      {/* Thin gradient divider to separate from footer */}
      <div className="blue-divider mx-auto max-w-6xl" />
    </div>
  );
}
