// src/site/components/MarketPage.tsx
import Link from "next/link";
import { MapPin, CheckCircle2, Info, ChevronRight } from "lucide-react";

type Market = {
  slug: string;
  name: string;
  country: string;
  city: string;
  summary: string;
  ctaJobsHref: string;
  mandates: { title: string; summary: string }[];
  hiringPulse: string[];
  regulatory: string[];
  comp?: {
    currency: string;
    baseBands?: {
      rmSenior: [number, number];
      rmMid: [number, number];
      teamLead: [number, number];
    };
    bonus?: {
      rmRange: [number, number];
      leadership: [number, number];
    };
    notes?: string;
  };
  ecosystem?: {
    title?: string;
    items?: string[];
    trends?: string[];
  };
};

const CURRENCY_SYMBOL: Record<string, string> = {
  CHF: "CHF",
  USD: "$",
  GBP: "£",
  AED: "AED",
  SGD: "S$",
  HKD: "HK$",
};

export default function MarketPage({ m }: { m: Market }) {
  const cur =
    CURRENCY_SYMBOL[m.comp?.currency ?? "CHF"] ??
    (m.comp?.currency ?? "CHF");

  return (
    <main className="page-glow text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        {/* Eyebrow */}
        <div className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 shadow-sm backdrop-blur">
          Market Insight
        </div>

        {/* Title & intro */}
        <header className="mt-4">
          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            Private Banking Recruitment in {m.name}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/80 md:text-base">
            {m.summary}
          </p>

          {/* Meta chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              {m.city}, {m.country}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              Currency: {cur}
            </span>
          </div>
        </header>

        {/* GRID */}
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="md:col-span-2 space-y-6">
            {/* Hiring Pulse */}
            <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 shadow-lg">
              <h2 className="text-lg font-bold md:text-xl">Hiring Pulse</h2>
              {Array.isArray(m.hiringPulse) && m.hiringPulse.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {m.hiringPulse.map((line, i) => (
                    <li key={i} className="text-sm text-neutral-300">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-neutral-400">
                  No hiring pulse data available.
                </p>
              )}
            </article>

            {/* Regulatory */}
            <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 shadow-lg">
              <h2 className="text-lg font-bold md:text-xl">Regulatory Must-Haves</h2>
              {Array.isArray(m.regulatory) && m.regulatory.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {m.regulatory.map((r, i) => (
                    <li key={i} className="text-sm text-neutral-300">
                      {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-neutral-400">
                  No regulatory notes available.
                </p>
              )}
            </article>

            {/* Compensation */}
            {m.comp && (
              <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 shadow-lg">
                <h2 className="text-lg font-bold md:text-xl">
                  Typical Senior PB Compensation ({cur})
                </h2>
                {m.comp.baseBands ? (
                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                    <div className="grid grid-cols-3 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80">
                      <div>Level</div>
                      <div>Base</div>
                      <div>Bonus</div>
                    </div>
                    {[
                      {
                        level: "Mid RM",
                        base: `${cur} ${m.comp.baseBands.rmMid[0].toLocaleString()}–${m.comp.baseBands.rmMid[1].toLocaleString()}`,
                        bonus: `${m.comp.bonus?.rmRange[0]}–${m.comp.bonus?.rmRange[1]}%`,
                      },
                      {
                        level: "Senior RM",
                        base: `${cur} ${m.comp.baseBands.rmSenior[0].toLocaleString()}–${m.comp.baseBands.rmSenior[1].toLocaleString()}`,
                        bonus: `${m.comp.bonus?.rmRange[0]}–${m.comp.bonus?.rmRange[1]}%`,
                      },
                      {
                        level: "Team Lead",
                        base: `${cur} ${m.comp.baseBands.teamLead[0].toLocaleString()}–${m.comp.baseBands.teamLead[1].toLocaleString()}`,
                        bonus: `${m.comp.bonus?.leadership[0]}–${m.comp.bonus?.leadership[1]}%`,
                      },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 px-3 py-2 text-sm text-white/90 odd:bg-white/[0.03]"
                      >
                        <div>{row.level}</div>
                        <div>{row.base}</div>
                        <div>{row.bonus}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-neutral-400">
                    No compensation data available.
                  </p>
                )}
                <p className="mt-2 text-[11px] text-neutral-400">
                  {m.comp?.notes ?? "Indicative only. Actual varies by role, bank, and performance."}
                </p>
              </article>
            )}

            {/* Ecosystem */}
            {m.ecosystem && (
              <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 shadow-lg">
                <h2 className="text-lg font-bold md:text-xl">
                  {m.ecosystem.title ?? `Banking Ecosystem (${m.name})`}
                </h2>
                {Array.isArray(m.ecosystem.items) && m.ecosystem.items.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {m.ecosystem.items.map((item, i) => (
                      <li key={i} className="text-sm text-neutral-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-neutral-400">No ecosystem data available.</p>
                )}
                {m.ecosystem.trends && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.ecosystem.trends.map((trend, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/85"
                      >
                        {trend}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            )}

            {/* Explore other markets */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-base font-semibold">Explore other markets</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["geneva","zurich","dubai","singapore","hong-kong","london","new-york","miami"]
                  .filter((s) => s !== m.slug)
                  .map((slug) => (
                    <Link
                      href={`/markets/${slug}`}
                      key={slug}
                      className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 hover:bg-white/10"
                    >
                      {slug.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Link>
                  ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="md:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur shadow-lg">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 opacity-80" />
                <span>
                  {m.city}, {m.country}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/80">
                Need a shortlist in {m.name}? We’ll align on coverage, portability, and onboarding — then
                move fast.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/hiring-managers"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,.35)] transition hover:bg-blue-700"
                >
                  Hire Talent
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Contact
                </Link>
              </div>
              <div className="mt-4 rounded-lg border border-white/12 bg-white/5 p-3 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Typical shortlist: 10–15 business days (brief-dependent).
                </div>
              </div>
              <Link
                href={m.ctaJobsHref}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90 underline-offset-4 hover:underline"
              >
                View market jobs <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
