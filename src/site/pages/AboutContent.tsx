'use client';
import Link from 'next/link';

type AboutStrings = {
  title: string; intro: string; body: string;
  highlights?: { title: string; items: string[] }[];
  ctas?: { primary?: string; secondary?: string };
};

export default function AboutContent({ t }: { t: AboutStrings }) {
  return (
    <div className="page-glow ep-container py-10 md:py-14">
      <header className="text-center">
        <span className="ep-chip">Executive Partners</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-neutral-300">{t.intro}</p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="ep-card md:col-span-2">
          <h3 className="text-xl font-semibold">Who we are</h3>
          <p className="mt-3">{t.body}</p>
        </article>
        <aside className="ep-card">
          <h3 className="text-xl font-semibold">At a glance</h3>
          <ul className="mt-3 space-y-2 text-neutral-300">
            <li>Geneva HQ · Zürich coverage</li>
            <li>Private Banking &amp; Wealth Management</li>
            <li>HNW / UHNW focus</li>
            <li>EMEA · UK · Asia · US</li>
          </ul>
        </aside>
      </section>

      {t.highlights?.length ? (
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {t.highlights.map((h, i) => (
            <div key={i} className="ep-card">
              <h3 className="text-lg font-semibold">{h.title}</h3>
              <ul className="mt-3 space-y-2 text-neutral-300">
                {h.items.map((it, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {t.ctas?.primary && <Link href="/contact" className="btn btn-primary btn-pill">{t.ctas.primary}</Link>}
        {t.ctas?.secondary && <Link href="/hiring-managers" className="btn btn-outline btn-pill">{t.ctas.secondary}</Link>}
      </div>

      <div className="mt-12 blue-divider" />
    </div>
  );
}
