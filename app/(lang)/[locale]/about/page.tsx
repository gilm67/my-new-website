import Link from "next/link";

/* ---------- Locale utils ---------- */
const LOCALES = ["en","fr","de"] as const;
type Locale = typeof LOCALES[number];
function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}
function L(href: string, locale: Locale) {
  return locale === "en" ? (href || "/") : `/${locale}${href || ""}`;
}

/* ---------- Content (EN exact; FR/DE localized) ---------- */
const EN = {
  heroTitle: "About Executive Partners — Connecting Top Talent with Private Banking Excellence",
  heroIntro:
    "Specialist search for Private Banking & Wealth Management. From Geneva and Zurich to global hubs including Dubai, Singapore, London and New York, we deliver targeted shortlists and discreet approach work for HNW/UHNW markets.",

  whoTitle: "Who we are",
  whoBody:
    "Executive Partners is a boutique executive search firm focused exclusively on Private Banking & Wealth Management. Headquartered in Geneva with an international footprint, we advise banks, EAMs and family offices on critical hires across Relationship Management, Desk/Market Heads and senior leadership.",

  whatTitle: "What we do",
  whatBullets: [
    "Front-office hires: Senior/Executive/Managing Directors, Team Heads, Market Leaders",
    "Strategic mandates: New-desk builds, market entries, M&A integration, key replacements",
    "Discreet approach work: Targeted outreach to specific bankers or teams",
    "Advisory: Portability assessment, compensation benchmarking, succession and team moves",
  ],

  whyTitle: "Why clients trust us",
  whyBlocks: [
    { h: "True sector specialists", p: "Former front-office and in-house talent leaders; fluent in cross-border, booking-centre and compliance realities." },
    { h: "Portability obsessed", p: "We validate client coverage, wallet share and realistic transfer potential—before you interview." },
    { h: "Targeted, not transactional", p: "Research-led market mapping and shortlists you can act on—no volume spam." },
    { h: "Confidential by design", p: "Quiet processes that protect brands, teams and careers." },
    { h: "Swiss execution, global reach", p: "Deep roots in Geneva/Zurich with active mandates across MEA, UK, US and APAC." },
  ],

  coverageTitle: "Coverage",
  coverageLists: [
    { h: "Switzerland (Onshore)", items: ["Geneva", "Zurich", "Lausanne"] },
    { h: "International hubs", items: ["Dubai", "London", "New York", "Singapore", "Hong Kong"] },
    { h: "Segments & Booking", items: ["HNW", "UHNW", "Entrepreneurs", "Family Offices", "CH / EU / UK / UAE / US / APAC"] },
  ],

  howTitle: "How we work",
  steps: [
    { n: "01", h: "Brief & calibration", p: "Clarify the mandate, success profile and compliance constraints." },
    { n: "02", h: "Market map", p: "Long-list the viable universe; pressure-test portability." },
    { n: "03", h: "Approach & vet", p: "Discreet outreach, structured evaluation, reference signals." },
    { n: "04", h: "Shortlist", p: "3–5 candidates you’d credibly hire." },
    { n: "05", h: "Close & land", p: "Offer design, risk checks and onboarding support." },
  ],

  valuesTitle: "Values",
  values: [
    { h: "Integrity", p: "Candid advice, even when it’s ‘not yet.’" },
    { h: "Discretion", p: "Quiet processes; zero market noise." },
    { h: "Outcomes", p: "Hires that perform—and stay." },
  ],

  ctaTitle: "Ready to discuss a mandate or a move?",
  ctaBody:
    "Hiring Manager: share your brief and timelines — expect a calibrated shortlist quickly. Candidates: speak confidentially about your market, portability and next step.",
  ctaPrimary: "Talk to us",
  ctaSecondary: "Request a shortlist",
};

const FR: typeof EN = {
  heroTitle: "À propos d’Executive Partners — Relier les meilleurs talents à l’excellence en Banque Privée",
  heroIntro:
    "Cabinet de chasse spécialisé en Banque Privée & Gestion de Patrimoine. De Genève et Zurich aux hubs internationaux comme Dubaï, Singapour, Londres et New York, nous livrons des shortlists ciblées et menons des approches discrètes sur les marchés HNW/UHNW.",

  whoTitle: "Qui sommes-nous",
  whoBody:
    "Executive Partners est un cabinet de recherche de cadres boutique, dédié exclusivement à la Banque Privée & à la Gestion de Patrimoine. Basés à Genève avec une empreinte internationale, nous conseillons banques, EAMs et family offices pour des recrutements clés : Relationship Managers, Chefs de Marché/Desk et direction senior.",

  whatTitle: "Ce que nous faisons",
  whatBullets: [
    "Recrutements front-office : Senior/Executive/Managing Directors, Team Heads, Market Leaders",
    "Mandats stratégiques : créations de desks, entrées de marché, intégration M&A, remplacements critiques",
    "Approches confidentielles : ciblage et outreach vers des banquiers ou des équipes spécifiques",
    "Conseil : évaluation de portabilité, benchmarks de rémunération, succession et mouvements d’équipes",
  ],

  whyTitle: "Pourquoi nos clients nous font confiance",
  whyBlocks: [
    { h: "Vrais spécialistes du secteur", p: "Ex-front-office et responsables talent in-house ; maîtrise des réalités transfrontalières, booking centres et conformité." },
    { h: "Obsédés par la portabilité", p: "Nous validons la couverture clientèle, le wallet share et le potentiel de transfert réaliste — avant vos entretiens." },
    { h: "Ciblé, pas transactionnel", p: "Cartographie marché pilotée par la recherche et shortlists actionnables — zéro spam volumique." },
    { h: "Confidentiel par design", p: "Des processus silencieux qui protègent marques, équipes et carrières." },
    { h: "Exécution suisse, portée globale", p: "Ancrage fort à Genève/Zurich, mandats actifs en MEA, UK, US et APAC." },
  ],

  coverageTitle: "Couverture",
  coverageLists: [
    { h: "Suisse (Onshore)", items: ["Genève", "Zurich", "Lausanne"] },
    { h: "Hubs internationaux", items: ["Dubaï", "Londres", "New York", "Singapour", "Hong Kong"] },
    { h: "Segments & Booking", items: ["HNW", "UHNW", "Entrepreneurs", "Family Offices", "CH / UE / UK / EAU / US / APAC"] },
  ],

  howTitle: "Notre façon de travailler",
  steps: [
    { n: "01", h: "Brief & calibration", p: "Clarifier le mandat, le profil de succès et les contraintes de conformité." },
    { n: "02", h: "Market mapping", p: "Long-list du vivier adressable ; stress test de la portabilité." },
    { n: "03", h: "Approche & sélection", p: "Outreach discret, évaluation structurée, signaux de références." },
    { n: "04", h: "Shortlist", p: "3–5 candidats crédibles à recruter." },
    { n: "05", h: "Closing & onboarding", p: "Design de l’offre, vérifications de risque et support à l’intégration." },
  ],

  valuesTitle: "Valeurs",
  values: [
    { h: "Intégrité", p: "Conseil franc, y compris quand la réponse est « pas encore »." },
    { h: "Discrétion", p: "Processus silencieux ; zéro bruit de marché." },
    { h: "Résultats", p: "Des recrutements qui performent — et restent." },
  ],

  ctaTitle: "Prêt à discuter d’un mandat ou d’une évolution ?",
  ctaBody:
    "Recruteur : partagez votre brief et vos délais — recevez rapidement une shortlist calibrée. Candidats : échangez en toute confidentialité sur votre marché, votre portabilité et la prochaine étape.",
  ctaPrimary: "Parler avec nous",
  ctaSecondary: "Demander une shortlist",
};

const DE: typeof EN = {
  heroTitle: "Über Executive Partners — Top-Talente mit Private-Banking-Exzellenz verbinden",
  heroIntro:
    "Spezialisierte Search für Private Banking & Wealth Management. Von Genf und Zürich bis zu globalen Hubs wie Dubai, Singapur, London und New York liefern wir zielgerichtete Shortlists und diskrete Ansprache für HNW/UHNW-Märkte.",

  whoTitle: "Wer wir sind",
  whoBody:
    "Executive Partners ist eine Boutique-Personalberatung mit ausschließlichem Fokus auf Private Banking & Wealth Management. Mit Hauptsitz in Genf und internationaler Reichweite beraten wir Banken, EAMs und Family Offices bei kritischen Besetzungen in Relationship Management, Desk-/Market-Leitung und Top-Management.",

  whatTitle: "Was wir tun",
  whatBullets: [
    "Front-Office-Besetzungen: Senior/Executive/Managing Directors, Team Heads, Market Leaders",
    "Strategische Mandate: Aufbau neuer Desks, Markteintritte, M&A-Integration, Schlüsselersatz",
    "Diskrete Direktansprache: Zielgerichtetes Outreach zu spezifischen Bankern oder Teams",
    "Advisory: Portabilitäts-Assessment, Vergütungs-Benchmarking, Nachfolge und Team-Moves",
  ],

  whyTitle: "Warum Kunden uns vertrauen",
  whyBlocks: [
    { h: "Echte Branchen-Spezialisten", p: "Ehemaliges Front-Office und In-House-Talentführung; sattelfest in Cross-Border, Booking Centers und Compliance." },
    { h: "Portabilität im Fokus", p: "Wir validieren Kundenabdeckung, Wallet-Share und realistische Transferpotenziale — vor Ihrem ersten Interview." },
    { h: "Gezielt statt transaktional", p: "Research-getriebene Marktkartierung und umsetzbare Shortlists — kein Volumen-Spam." },
    { h: "Vertraulich by Design", p: "Leise Prozesse, die Marken, Teams und Karrieren schützen." },
    { h: "Schweizer Ausführung, globale Reichweite", p: "Tiefe Wurzeln in Genf/Zürich, aktive Mandate in MEA, UK, US und APAC." },
  ],

  coverageTitle: "Abdeckung",
  coverageLists: [
    { h: "Schweiz (Onshore)", items: ["Genf", "Zürich", "Lausanne"] },
    { h: "Internationale Hubs", items: ["Dubai", "London", "New York", "Singapur", "Hongkong"] },
    { h: "Segmente & Booking", items: ["HNW", "UHNW", "Unternehmer", "Family Offices", "CH / EU / UK / VAE / US / APAC"] },
  ],

  howTitle: "So arbeiten wir",
  steps: [
    { n: "01", h: "Briefing & Kalibrierung", p: "Mandat, Erfolgskriterien und Compliance-Rahmen schärfen." },
    { n: "02", h: "Market Map", p: "Adressierbares Universum long-listen; Portabilität stress-testen." },
    { n: "03", h: "Ansprache & Prüfung", p: "Diskretes Outreach, strukturierte Evaluation, Referenz-Signale." },
    { n: "04", h: "Shortlist", p: "3–5 Kandidat:innen, die Sie realistisch einstellen." },
    { n: "05", h: "Closing & Landing", p: "Offer-Design, Risk-Checks und Onboarding-Support." },
  ],

  valuesTitle: "Werte",
  values: [
    { h: "Integrität", p: "Ehrlicher Rat, auch wenn die Antwort „noch nicht“ lautet." },
    { h: "Diskretion", p: "Stille Prozesse; kein Marktrauschen." },
    { h: "Resultate", p: "Besetzungen, die performen — und bleiben." },
  ],

  ctaTitle: "Bereit, ein Mandat oder einen Wechsel zu besprechen?",
  ctaBody:
    "Hiring Manager: Brief & Timing teilen — eine kalibrierte Shortlist folgt zügig. Kandidat:innen: Vertraulich über Markt, Portabilität und nächste Schritte sprechen.",
  ctaPrimary: "Sprechen Sie mit uns",
  ctaSecondary: "Shortlist anfordern",
};

const STR: Record<Locale, typeof EN> = { en: EN, fr: FR, de: DE };

export const dynamic = "force-static";

/** Next.js 15 note: params may be a Promise in some setups */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const awaited =
    (typeof (params as any)?.then === "function" ? await (params as Promise<{ locale: string }>) : (params as { locale: string }));

  const raw = awaited.locale;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const t = STR[locale];

  return (
    <div className="page-glow ep-container py-10 md:py-14">
      {/* Hero */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t.heroTitle}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-neutral-300">{t.heroIntro}</p>
      </header>

      {/* Who we are */}
      <section className="mt-10 md:mt-14 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">{t.whoTitle}</h2>
        <p className="mt-3 text-neutral-300 leading-relaxed">{t.whoBody}</p>
      </section>

      {/* What we do */}
      <section className="mt-10 md:mt-14 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">{t.whatTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {t.whatBullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-neutral-300">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Why clients trust us */}
      <section className="mt-10 md:mt-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">{t.whyTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {t.whyBlocks.map((b, i) => (
            <article key={i} className="ep-card">
              <h3 className="text-lg font-semibold">{b.h}</h3>
              <p className="mt-2 text-neutral-300">{b.p}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section className="mt-10 md:mt-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">{t.coverageTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {t.coverageLists.map((col, i) => (
            <div key={i} className="ep-card">
              <h3 className="text-lg font-semibold">{col.h}</h3>
              <ul className="mt-3 space-y-1 text-neutral-300">
                {col.items.map((x, j) => (
                  <li key={j}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How we work + Values */}
      <section className="mt-10 md:mt-14 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 ep-card">
          <h2 className="text-xl font-bold">{t.howTitle}</h2>
          <ol className="mt-4 space-y-3">
            {t.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="inline-flex h-6 w-10 shrink-0 items-center justify-center rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  {s.n}
                </span>
                <div>
                  <div className="font-semibold">{s.h}</div>
                  <div className="text-neutral-300">{s.p}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="ep-card">
          <h2 className="text-xl font-bold">{t.valuesTitle}</h2>
          <ul className="mt-4 space-y-3">
            {t.values.map((v, i) => (
              <li key={i}>
                <div className="font-semibold">{v.h}</div>
                <div className="text-neutral-300">{v.p}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 md:mt-16 ep-card text-center">
        <h2 className="text-2xl md:text-3xl font-bold">{t.ctaTitle}</h2>
        <p className="mt-3 text-neutral-300">{t.ctaBody}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href={L("/contact", locale)} className="ep-btn ep-btn-primary">
            {t.ctaPrimary}
          </Link>
          <Link href={L("/hiring-managers", locale)} className="ep-btn ep-btn-ghost">
            {t.ctaSecondary}
          </Link>
        </div>
      </section>
    </div>
  );
}
