'use client';

import Link from 'next/link';
import { CONTENT } from '@/i18n/content';
import { useLocale } from '@/hooks/useLocale';

export default function ContactContent() {
  const locale = useLocale();
  const t = CONTENT[locale].contact;

  return (
    <div className="page-glow">
      <header className="text-center">
        <span className="ep-chip">Get in touch</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-300">{t.intro}</p>
      </header>

      <section className="mx-auto mt-8 grid max-w-3xl gap-6">
        <div className="ep-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-white/70">{t.contact?.emailLabel}</div>
              <Link href={`mailto:${t.contact?.email}`} className="text-lg font-semibold">
                {t.contact?.email}
              </Link>
            </div>
            {t.contact?.phone && (
              <div>
                <div className="text-sm text-white/70">{t.contact?.phoneLabel}</div>
                <a href={`tel:${t.contact?.phone}`} className="text-lg font-semibold">
                  {t.contact?.phone}
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/contact" className="btn btn-primary">{t.ctas?.primary}</Link>
            <Link href="https://www.linkedin.com/company/executive-partners/" target="_blank" className="btn btn-outline">
              {t.ctas?.secondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
