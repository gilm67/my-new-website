// app/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ChevronRight } from "lucide-react";

/* ------------ Types & helpers ------------ */
type Job = {
  id?: string;
  title: string;
  location: string;
  market?: string;
  seniority?: string;
  summary?: string;
  slug: string;
  confidential?: boolean;
  active?: boolean;
  createdAt?: string;
};

const HIDDEN_SLUGS = new Set<string>([
  "senior-relationship-manager-ch-onshore-4",
  "senior-relationship-manager-brazil-2",
  "private-banker-mea-2",
]);

async function getFeaturedJobs(): Promise<Job[]> {
  const qs = new URLSearchParams({ active: "true", sort: "newest", limit: "6" }).toString();
  const abs = (process.env.NEXT_PUBLIC_SITE_URL ?? "") + `/api/jobs?${qs}`;

  const r1 = await fetch(abs, { cache: "no-store" }).catch(() => null);
  const data =
    r1?.ok
      ? await r1.json()
      : await (async () => {
          const r2 = await fetch(`/api/jobs?${qs}`, { cache: "no-store" }).catch(() => null);
          if (!r2?.ok) return [];
          return r2.json();
        })();

  return (Array.isArray(data) ? data : [])
    .filter((j) => j?.active !== false && !HIDDEN_SLUGS.has(j.slug))
    .slice(0, 3);
}

/* ------------ SEO ------------ */
export const metadata: Metadata = {
  title: { absolute: "Executive Partners – Private Banking & Wealth Management Search" },
  description:
    "Executive Partners is Switzerland’s leading recruiter in private banking and wealth management. From our base in Geneva, we connect seasoned Relationship Managers with confidential opportunities in Zurich, Dubai, Singapore, London, New York, and Miami.",
};

/* ---------------- Page ---------------- */
export default async function HomePage() {
  const featured = await getFeaturedJobs();

  return (
    <main className="relative text-white">
      {/* Premium gradient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px_420px_at_18%_-10%,rgba(59,130,246,.16) 0%, rgba(59,130,246,0) 60%), radial-gradient(1000px_380px_at_110%_0%, rgba(16,185,129,.15) 0%, rgba(16,185,129,0) 60%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(800px_200px_at_center_top,rgba(255,255,255,.06),transparent)]" />
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-16 text-center md:pt-24 md:pb-20">
          <span className="ep-chip">International &amp; Swiss Private Banking — HNW/UHNW</span>

          {/* ✅ Title: exactly two lines, balanced
              - On md+ we prevent wrapping inside the first line (whitespace-nowrap)
              - On small screens, it may wrap naturally to avoid overflow
              - Responsive clamp keeps it large but safe */}
          <h1 className="mx-auto mt-6 text-center font-extrabold tracking-tight leading-[1.06]">
            <span className="block md:inline-block md:whitespace-nowrap text-[clamp(2.25rem,6vw,4.75rem)]">
              Private Banking&nbsp;&amp;&nbsp;Wealth Management
            </span>
            <span className="block mt-1 text-[clamp(2.25rem,6vw,4.75rem)]">
              Search
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-neutral-300">
            Executive Partners is Switzerland’s leading financial recruiter for private banking and wealth
            management. From our base in Geneva, we connect seasoned Relationship Managers and senior leaders
            with confidential opportunities in Zurich, Dubai, Singapore, London, and New York.
          </p>

          {/* Hero CTAs — equal width, aligned */}
          <div className="mx-auto mt-10 w-full max-w-3xl">
            <div className="grid grid-cols-3 gap-4">
              <CTAButton href="/candidates" label="I’m a Candidate" tone="blue" />
              <CTAButton href="/hiring-managers" label="I’m Hiring" tone="outline" />
              <CTAButton href="/jobs" label="View Private Banking Jobs" tone="outline" />
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-neutral-400">
            Focus market:{" "}
            <Link href="/private-banking-jobs-switzerland" className="underline underline-offset-4 hover:text-white">
              Private Banking jobs in Switzerland
            </Link>
            {" · "}
            <Link href="/markets" className="underline underline-offset-4 hover:text-white">
              Markets We Serve
            </Link>
          </p>
        </div>
      </section>

      {/* VALUE CARDS */}
      <section className="relative py-12">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="grid items-stretch gap-8 md:grid-cols-2">
            <ValueCard
              badge="For Candidates"
              title="Confidential career moves"
              copy="We work discreetly with UHNW/HNW talent. Explore live mandates or register to be matched with roles that fit your market, seniority, and portability."
              primary={{ href: "/jobs", label: "Browse Jobs" }}
              secondary={{ href: "/candidates", label: "Candidate Hub" }}
              badgeTone="green"
              primaryTone="blue"
            />
            <ValueCard
              badge="For Hiring Managers"
              title="Targeted shortlists, fast"
              copy="We map markets and deliver vetted shortlists with real portability. Post a new role or ask us to discreetly approach specific bankers."
              primary={{ href: "/hiring-managers", label: "Hire Talent" }}
              secondary={{ href: "/contact", label: "Talk to Us" }}
              badgeTone="green"
              primaryTone="green"
            />
          </div>
        </div>
      </section>

      {/* FEATURED ROLES */}
      <section className="relative">
        <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Roles</h2>
            <Link
              href="/jobs"
              className="text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
            >
              View all jobs →
            </Link>
          </div>

          <div className="mt-6 grid items-stretch gap-6 md:grid-cols-3">
            {(featured.length ? featured : FALLBACK_ROLES).map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- Local fallback data ---------- */
const FALLBACK_ROLES: Job[] = [
  {
    title: "Senior Relationship Manager — CH Onshore",
    location: "Geneva",
    summary: "UHNW/HNW Swiss-domiciled clients; Geneva booking centre; strong local network required.",
    slug: "senior-relationship-manager-ch-onshore-geneva",
    active: true,
  },
  {
    title: "Private Banker — MEA",
    location: "Dubai",
    summary: "Cover UHNW/HNW MEA clients from Dubai; strong acquisition and cross-border expertise.",
    slug: "senior-relationship-manager-mea-dubai",
    active: true,
  },
  {
    title: "Senior Relationship Manager — Brazil",
    location: "Zurich or Geneva",
    summary:
      "Develop and manage HNW/UHNW Brazilian clients; full private banking advisory and cross-border expertise.",
    slug: "senior-relationship-manager-brazil-ch",
    active: true,
  },
];

/* ---------------- Reusable CTA Button ---------------- */
function CTAButton({
  href,
  label,
  tone = "blue",
}: {
  href: string;
  label: string;
  tone?: "blue" | "neutral" | "green" | "outline";
}) {
  const base =
    "inline-flex h-14 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold leading-none transition";

  if (tone === "blue")
    return (
      <Link
        href={href}
        className={`${base} bg-blue-600 text-white shadow-[0_18px_45px_rgba(37,99,235,.45)] hover:bg-blue-700`}
      >
        {label}
      </Link>
    );

  if (tone === "green")
    return (
      <Link
        href={href}
        className={`${base} bg-emerald-600 text-white shadow-[0_18px_45px_rgba(16,185,129,.35)] hover:bg-emerald-500`}
      >
        {label}
      </Link>
    );

  if (tone === "outline")
    return (
      <Link
        href={href}
        className={`${base} border border-white/30 bg-transparent text-white hover:bg-white/10`}
      >
        {label}
      </Link>
    );

  return (
    <Link
      href={href}
      className={`${base} border border-white/20 bg-white/5 text-white hover:bg-white/10`}
    >
      {label}
    </Link>
  );
}

/* ---------------- ValueCard ---------------- */
function ValueCard({
  badge,
  title,
  copy,
  primary,
  secondary,
  badgeTone = "green",
  primaryTone = "blue",
}: {
  badge: string;
  title: string;
  copy: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  badgeTone?: "green" | "blue";
  primaryTone?: "green" | "blue" | "neutral";
}) {
  const badgeClass = badgeTone === "green" ? "text-emerald-400" : "text-blue-400";

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-sky-500/30 to-emerald-400/30 opacity-40 blur-2xl"
      />
      <div className="relative flex min-h-[240px] flex-col">
        <span className={`text-xs font-semibold ${badgeClass}`}>{badge}</span>
        <h3 className="mt-3 text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-neutral-300">{copy}</p>
        <div className="mt-auto flex gap-3 pt-4">
          <CTAButton href={primary.href} label={primary.label} tone={primaryTone} />
          <CTAButton href={secondary.href} label={secondary.label} tone="outline" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- JobCard ---------------- */
function JobCard({ job }: { job: Job }) {
  return (
    <article className="group relative h-full rounded-2xl bg-gradient-to-br from-sky-500/35 via-emerald-400/25 to-fuchsia-500/25 p-[1px]">
      <div className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-[#0B0E13]/80 p-5 backdrop-blur transition group-hover:-translate-y-0.5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full bg-gradient-to-br from-sky-500/30 to-emerald-400/30 opacity-40 blur-2xl"
        />
        <h3 className="min-h-[3.25rem] text-lg font-semibold text-white line-clamp-2">{job.title}</h3>
        <div className="mt-2 min-h-[1.6rem]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
            <MapPin className="h-3.5 w-3.5 opacity-80" />
            {job.location}
          </span>
        </div>
        <p className="mt-3 min-h-[3.75rem] text-sm text-neutral-300 line-clamp-3">{job.summary}</p>
        <div className="mt-auto pt-4">
          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2 text-sm font-semibold text-white outline-none ring-0 transition hover:bg-white/12 hover:shadow-[0_10px_30px_rgba(59,130,246,.25)] focus-visible:ring-2 focus-visible:ring-sky-500/40"
          >
            View details
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
