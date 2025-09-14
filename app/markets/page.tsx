import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { markets as ALL_MARKETS } from "@/lib/markets";

/* ---------------- SEO ---------------- */
export const metadata: Metadata = {
  title: { absolute: "Markets We Serve | Executive Partners" },
  description:
    "Explore private banking & wealth management markets we serve — Geneva, Zürich, Dubai, Singapore, Hong Kong, London, New York, and Miami.",
};

/* Preferred visual order */
const ORDER = [
  "geneva",
  "zurich",
  "dubai",
  "singapore",
  "hong-kong",
  "london",
  "new-york",
  "miami",
] as const;

const markets = ORDER
  .map(slug => ALL_MARKETS.find(m => m.slug === slug))
  .filter(Boolean);

/* ---------------- Page ---------------- */
export default function MarketsIndex() {
  return (
    <main className="relative text-white">
      {/* backdrop (subtle) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px_420px_at_18%_-10%,rgba(59,130,246,.12) 0%, rgba(59,130,246,0) 60%), radial-gradient(1000px_380px_at_110%_0%, rgba(16,185,129,.10) 0%, rgba(16,185,129,0) 60%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Chip */}
        <div className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 shadow-sm backdrop-blur">
          Markets we serve
        </div>

        {/* Title + intro (balanced like homepage) */}
        <h1 className="mt-5 text-center font-extrabold leading-[1.06] tracking-tight">
          <span className="text-balance text-[clamp(2.25rem,5.6vw,3.6rem)]">
            Private Banking &amp; Wealth Management
          </span>
          <br />
          <span className="text-[clamp(2.25rem,5.6vw,3.6rem)]">Markets</span>
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-center text-[15.5px] md:text-[16.5px] leading-relaxed text-neutral-200">
          Geneva-based, globally connected. We build targeted shortlists in key booking centres and
          onshore hubs — with real portability and regulatory fluency.
        </p>

        {/* Quick jump pills */}
        <div className="mx-auto mt-6 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2">
          {markets.map((m) => (
            <Link
              key={m!.slug}
              href={`/markets/${m!.slug}`}
              className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 hover:bg-white/10"
            >
              {m!.name}
            </Link>
          ))}
        </div>

        {/* Grid of market cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((m) => {
            const ecoTitle = m!.ecosystem?.title ?? `Banking Ecosystem (${m!.name})`;
            return (
              <article
                key={m!.slug}
                className="group relative rounded-2xl bg-gradient-to-br from-sky-500/30 via-emerald-400/20 to-fuchsia-500/20 p-[1px] transition hover:-translate-y-0.5"
              >
                <div className="h-full rounded-2xl border border-white/10 bg-[#0B0E13]/80 p-5 backdrop-blur">
                  {/* Heading row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 opacity-80" />
                      <h2 className="text-lg font-semibold">{m!.name}</h2>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/75">
                      {m!.country}
                    </span>
                  </div>

                  {/* Subheadline */}
                  <p className="mt-2 line-clamp-3 text-sm text-neutral-300">
                    {m!.headline}
                  </p>

                  {/* Ecosystem mini-list */}
                  {Array.isArray(m!.ecosystem?.items) && m!.ecosystem.items.length > 0 && (
                    <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="text-xs font-semibold text-white/80">{ecoTitle}</div>
                      <ul className="mt-2 space-y-1 text-xs text-neutral-300">
                        {m!.ecosystem.items.slice(0, 2).map((it, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
                            <span className="line-clamp-1">{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/markets/${m!.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,.35)] transition hover:bg-blue-700"
                    >
                      View market <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/jobs?market=${m!.slug}`}
                      className="text-sm text-white/85 underline-offset-4 hover:underline"
                    >
                      Browse jobs
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA band */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-blue-600/10 to-transparent p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold">Need a market-mapped shortlist?</h3>
              <p className="mt-1 text-sm text-neutral-300">
                We’ll align on coverage, portability, and onboarding requirements — then move fast.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/hiring-managers"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,.35)] transition hover:bg-blue-700"
              >
                Hire Talent
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
