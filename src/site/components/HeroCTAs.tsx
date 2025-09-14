'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ui, type Locale } from '@/i18n/ui';

function useLocale(): Locale {
  const path = usePathname() || '/en';
  const seg = path.split('/')[1];
  if (seg === 'fr' || seg === 'de') return seg;
  return 'en';
}

export default function HeroCTAs() {
  const locale = useLocale();
  const t = ui[locale];
  const L = (slug: string) => `/${locale}${slug}`;

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      <div className="grid grid-cols-3 gap-4">
        <Link
          href={L('/candidates')}
          className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#2457E6] px-5 text-sm font-semibold leading-none text-white shadow-[0_18px_45px_rgba(36,87,230,.45)] transition hover:bg-[#1E49C8]"
        >
          {t.ctas.iAmCandidate}
        </Link>
        <Link
          href={L('/hiring-managers')}
          className="inline-flex h-14 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold leading-none text-white transition hover:bg-white/10"
        >
          {t.ctas.iAmHiring}
        </Link>
        <Link
          href={L('/jobs')}
          className="inline-flex h-14 w-full items-center justify-center rounded-xl border border-white/20 bg-transparent px-5 text-sm font-semibold leading-none text-white transition hover:bg-white/5"
        >
          {t.ctas.viewJobs}
        </Link>
      </div>
    </div>
  );
}
