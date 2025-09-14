"use client";

import { useState } from "react";

type Payload = {
  title: string;
  market: string;
  location: string;
  seniority: string;
  summary: string;
  confidential: boolean;
  contactName: string;
  contactEmail: string;
  // honeypot (should stay empty)
  company?: string;
};

const defaultData: Payload = {
  title: "",
  market: "",
  location: "",
  seniority: "",
  summary: "",
  confidential: true,
  contactName: "",
  contactEmail: "",
  company: "",
};

export default function PublicBriefForm() {
  const [data, setData] = useState<Payload>(defaultData);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string | null>(null);

  const onChange = (k: keyof Payload, v: any) => {
    setOk(null); // clear success on further edits
    setErr(null); // clear errors as user fixes inputs
    setData((d) => ({ ...d, [k]: v }));
  };

  const validate = (): string | null => {
    if (!data.title.trim()) return "Please add a role title.";
    if (!data.market.trim()) return "Please choose a market.";
    if (!data.location.trim()) return "Please add a location.";
    if (!data.seniority.trim()) return "Please add a seniority.";
    if (!data.summary.trim()) return "Please add a short summary.";
    if (!data.contactName.trim()) return "Please add your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.contactEmail))
      return "Please enter a valid email.";
    if (data.company && data.company.trim().length > 0) {
      // honeypot filled => likely a bot
      return "Submission blocked.";
    }
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setErr(msg);
      setOk(false);
      return;
    }

    setSubmitting(true);
    setErr(null);
    setOk(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only send the fields the API expects (omit honeypot)
        body: JSON.stringify({
          title: data.title.trim(),
          market: data.market.trim(),
          location: data.location.trim(),
          seniority: data.seniority.trim(),
          summary: data.summary.trim(),
          confidential: Boolean(data.confidential),
          contactName: data.contactName.trim(),
          contactEmail: data.contactEmail.trim(),
        }),
      });

      const json = await res.json().catch(() => ({} as any));

      if (res.ok && json?.ok) {
        setOk(true);
        setData(defaultData);
      } else {
        setOk(false);
        setErr(json?.error || "Something went wrong. Please try again.");
      }
    } catch (e) {
      setOk(false);
      setErr("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      {/* Honeypot field (hidden from users) */}
      <div className="hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          autoComplete="off"
          tabIndex={-1}
          value={data.company}
          onChange={(e) => onChange("company", e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm text-neutral-300">Role Title*</label>
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-black/20 p-2 outline-none"
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Senior Relationship Manager / Team Head"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-300">Market*</label>
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-black/20 p-2 outline-none"
            value={data.market}
            onChange={(e) => onChange("market", e.target.value)}
            placeholder="CH Onshore / MEA / UK / APAC…"
            required
            aria-required="true"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm text-neutral-300">Location*</label>
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-black/20 p-2 outline-none"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="Geneva / Zurich / Dubai / London…"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-300">Seniority*</label>
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-black/20 p-2 outline-none"
            value={data.seniority}
            onChange={(e) => onChange("seniority", e.target.value)}
            placeholder="Director / MD / Team Head"
            required
            aria-required="true"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-300">Short Summary*</label>
        <textarea
          className="mt-1 w-full rounded-md border border-white/10 bg-black/20 p-2 outline-none"
          rows={5}
          value={data.summary}
          onChange={(e) => onChange("summary", e.target.value)}
          placeholder="UHNW build-out; booking in CH & SG; portability required; cross-border constraints…"
          required
          aria-required="true"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="confidential"
          type="checkbox"
          className="h-4 w-4"
          checked={data.confidential}
          onChange={(e) => onChange("confidential", e.target.checked)}
        />
        <label htmlFor="confidential" className="text-sm text-neutral-300">
          Keep posting unlisted (share privately only)
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm text-neutral-300">Your Name*</label>
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-black/20 p-2 outline-none"
            value={data.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
            placeholder="First Last"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-300">Work Email*</label>
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-black/20 p-2 outline-none"
            value={data.contactEmail}
            onChange={(e) => onChange("contactEmail", e.target.value)}
            placeholder="name@bank.com"
            inputMode="email"
            required
            aria-required="true"
          />
        </div>
      </div>

      {err && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300">
          {err}
        </p>
      )}
      {ok && !err && (
        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2 text-sm text-emerald-300">
          Thanks — your brief was received. We’ll reply shortly.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
        aria-busy={submitting}
      >
        {submitting ? "Submitting…" : "Submit Brief"}
      </button>
    </form>
  );
}
