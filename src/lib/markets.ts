// src/lib/markets.ts

export type Market = {
  slug: string;
  name: string;
  country: string;
  city: string;
  region?: string;
  summary: string;
  ctaJobsHref: string;
  mandates: { title: string; summary: string }[];
  hiringPulse: string[]; // executive-style market signals
  regulatory: string[];
  comp?: {
    currency: "CHF" | "AED" | "SGD" | "HKD" | "GBP" | "USD";
    baseBands: {
      rmSenior: [number, number];
      rmMid: [number, number];
      teamLead: [number, number];
    };
    bonus: {
      rmRange: [number, number];     // % of base, indicative
      leadership: [number, number];  // % of base, indicative
    };
    notes?: string;
  };
  ecosystem?: {
    title: string;
    items: string[];
    trends?: string[];
  };
};

/* ---------------- Geneva ---------------- */
const geneva: Market = {
  slug: "geneva",
  name: "Geneva",
  country: "Switzerland",
  city: "Geneva",
  region: "CH Onshore & Cross-Border",
  summary:
    "Switzerland’s discreet capital for wealth, Geneva combines UHNW family offices, global booking centres, and a deep cross-border tradition in LatAm and MEA.",
  ctaJobsHref: "/jobs?market=geneva",
  mandates: [
    { title: "Senior RM — CH Onshore", summary: "UHNW/HNW Swiss-domiciled clients; Geneva booking centre; strong local network required." },
    { title: "Private Banker — MEA", summary: "Cover UHNW/HNW MEA clients from Geneva; acquisition + portability key." },
  ],
  hiringPulse: [
    "Portability is non-negotiable: clean, referenceable revenue with low risk flags.",
    "Onshore CH + FR/IT cross-border dual coverage outcompetes single-market books.",
    "Teams with proven DPM penetration and lending velocity see faster offers.",
  ],
  regulatory: [
    "FINMA fit & proper; CH cross-border rules",
    "MiFID II / EU CB rules for EU clients",
    "KYC/AML depth on legacy books",
  ],
  comp: {
    currency: "CHF",
    baseBands: {
      rmSenior: [180000, 280000],
      rmMid: [130000, 180000],
      teamLead: [250000, 350000],
    },
    bonus: { rmRange: [30, 80], leadership: [40, 120] },
    notes: "Indicative only; varies by platform, coverage, portability, and revenue model.",
  },
  ecosystem: {
    title: "Geneva ecosystem",
    items: ["Global booking centre depth", "LatAm/MEA desks; FO presence", "UHNW advisory platforms"],
    trends: ["Capital protection", "DPM growth", "Lombard lending"],
  },
};

/* ---------------- Zurich ---------------- */
const zurich: Market = {
  slug: "zurich",
  name: "Zurich",
  country: "Switzerland",
  city: "Zurich",
  region: "CH Onshore & International",
  summary:
    "Zurich is Switzerland’s largest private banking hub, blending onshore UHNW coverage with powerful DACH/CEE platforms and a sophisticated alternatives market.",
  ctaJobsHref: "/jobs?market=zurich",
  mandates: [
    { title: "Senior RM — Brazil", summary: "Develop HNW/UHNW Brazilian clients; Zurich or Geneva; full PB advisory." },
    { title: "Team Lead — CH Onshore", summary: "Lead senior RMs; manage P&L and growth KPIs." },
  ],
  hiringPulse: [
    "Multi-jurisdiction books (CH + EU/LatAm) command premiums; single-market less competitive.",
    "Credit and structured lending capability is the key differentiator for top platforms.",
    "Leadership hires skew to operators who can tighten risk while accelerating NNM.",
  ],
  regulatory: [
    "FINMA fit & proper",
    "Cross-border (EU/LatAm) controls",
    "SoW/SoF scrutiny on inflows",
  ],
  comp: {
    currency: "CHF",
    baseBands: {
      rmSenior: [190000, 300000],
      rmMid: [140000, 190000],
      teamLead: [270000, 380000],
    },
    bonus: { rmRange: [35, 90], leadership: [50, 130] },
    notes: "Top performers with portable revenue can exceed ranges; deferrals and clawbacks common.",
  },
  ecosystem: {
    title: "Zurich ecosystem",
    items: ["Deep product shelves (AM, lending, alts)", "Multi-booking capabilities", "FO and EAM density"],
    trends: ["Credit solutions", "Alternatives", "Book migration deals"],
  },
};

/* ---------------- Dubai ---------------- */
const dubai: Market = {
  slug: "dubai",
  name: "Dubai",
  country: "UAE",
  city: "Dubai",
  region: "GCC/MEA",
  summary:
    "Dubai has emerged as the MEA wealth magnet — tax-friendly, fast-growing, and increasingly home to UHNW families and international private banks.",
  ctaJobsHref: "/jobs?market=dubai",
  mandates: [
    { title: "Private Banker — MEA", summary: "UHNW/HNW MEA clients; strong acquisition record; cross-border compliant." },
    { title: "Desk Head — GCC", summary: "Build and lead team; revenue management and NNM targets." },
  ],
  hiringPulse: [
    "Banks are scaling GCC coverage; portable Saudi/UAE/Kuwait revenue gets immediate traction.",
    "Relocation support + accelerated onboarding offered to proven originators.",
    "Leadership mandates prioritise governance maturity and franchise-safe growth.",
  ],
  regulatory: [
    "DFSA/FSRA frameworks",
    "Cross-border into GCC states",
    "Enhanced KYC/EDD on inbound funds",
  ],
  comp: {
    currency: "AED",
    baseBands: {
      rmSenior: [700000, 1100000],
      rmMid: [450000, 700000],
      teamLead: [1000000, 1600000],
    },
    bonus: { rmRange: [40, 120], leadership: [60, 150] },
    notes: "Tax-free comp; housing/education allowances may apply.",
  },
  ecosystem: {
    title: "Dubai ecosystem",
    items: ["Regional hub; global booking links", "Relocation magnet for UHNW families", "Growing FO/MFO presence"],
    trends: ["Wealth migration", "Sharia-compliant solutions", "FX flows"],
  },
};

/* ---------------- Singapore ---------------- */
const singapore: Market = {
  slug: "singapore",
  name: "Singapore",
  country: "Singapore",
  city: "Singapore",
  region: "SEA/Greater China",
  summary:
    "Singapore is Asia’s stable wealth centre, a leading gateway for SEA and NRI clients with strong custody, credit, and family office infrastructure.",
  ctaJobsHref: "/jobs?market=singapore",
  mandates: [
    { title: "Senior RM — SEA", summary: "UHNW/HNW SEA book; acquisition focus; MAS fit & proper." },
    { title: "Team Lead — NRI", summary: "Lead NRI desk; scale AUM and NNM; manage risk/compliance." },
  ],
  hiringPulse: [
    "Steady demand across SEA/NRI; clean portability beats headline AUM.",
    "DPM penetration and private markets access materially lift offer quality.",
    "Control culture is decisive — MAS-ready candidates progress fastest.",
  ],
  regulatory: [
    "MAS fit & proper; FAA rules",
    "Suitability regime & AI status",
    "Cross-border limits into ID/TH/PH",
  ],
  comp: {
    currency: "SGD",
    baseBands: {
      rmSenior: [220000, 320000],
      rmMid: [160000, 220000],
      teamLead: [300000, 420000],
    },
    bonus: { rmRange: [35, 100], leadership: [50, 130] },
    notes: "Revenue-linked variable pay prevalent; deferrals common at global banks.",
  },
  ecosystem: {
    title: "Singapore ecosystem",
    items: ["PB platforms; DPM penetration", "Trust/custody & credit solutions", "FO & family office growth"],
    trends: ["DPM uptake", "Private markets access", "Lombard lending"],
  },
};

/* ---------------- Hong Kong ---------------- */
const hongKong: Market = {
  slug: "hong-kong",
  name: "Hong Kong",
  country: "Hong Kong SAR",
  city: "Hong Kong",
  region: "Greater China",
  summary:
    "Hong Kong remains a critical hub for Greater China and North Asia, offering deep markets access, equity structured products, and proximity to Mainland UHNW clients.",
  ctaJobsHref: "/jobs?market=hong-kong",
  mandates: [
    { title: "Senior RM — Greater China", summary: "UHNW/HNW GC coverage; equity solutions & structured products." },
    { title: "Product Specialist — Alternatives", summary: "Work with UHNW desks on PE/VC/hedge strategies." },
  ],
  hiringPulse: [
    "Selective ramp-up: banks lean toward GC RMs with documented controls and stable inflows.",
    "Product specialists (alts/derivs) are a swing factor in platform competitiveness.",
    "Portability verified via verifiable pipeline > headline claims.",
  ],
  regulatory: [
    "HKMA/SFC licensing",
    "Suitability & product risk grading",
    "Cross-border into Mainland under local rules",
  ],
  comp: {
    currency: "HKD",
    baseBands: {
      rmSenior: [1200000, 1800000],
      rmMid: [800000, 1200000],
      teamLead: [1700000, 2500000],
    },
    bonus: { rmRange: [30, 90], leadership: [40, 120] },
    notes: "Guarantees offered sparingly; deferral schedules vary by platform.",
  },
  ecosystem: {
    title: "Hong Kong ecosystem",
    items: ["Markets access; structured products", "Booking flexibility", "FO/EO presence"],
    trends: ["Connect schemes", "China FO growth", "Equity derivatives"],
  },
};

/* ---------------- London ---------------- */
const london: Market = {
  slug: "london",
  name: "London",
  country: "United Kingdom",
  city: "London",
  region: "UK/EMEA",
  summary:
    "London is Europe’s financial capital, anchoring UHNW coverage across UK onshore, non-dom, and international EMEA clients with unrivalled alternatives access.",
  ctaJobsHref: "/jobs?market=london",
  mandates: [
    { title: "Senior RM — UK Onshore", summary: "UHNW/HNW UK residents; DPM & lending; portability expected." },
    { title: "Desk Head — EMEA", summary: "Lead multi-country RM team; governance and growth." },
  ],
  hiringPulse: [
    "Consumer Duty has raised the bar — governance fluency is now a hiring filter.",
    "RMs with lending + private markets access convert faster than pure-advisory profiles.",
    "Non-dom and entrepreneur coverage with credible tax advisory links is prized.",
  ],
  regulatory: [
    "FCA SMCR",
    "Suitability, PROD, Consumer Duty",
    "Cross-border frameworks (EEA/CH/MEA)",
  ],
  comp: {
    currency: "GBP",
    baseBands: {
      rmSenior: [150000, 230000],
      rmMid: [110000, 150000],
      teamLead: [220000, 320000],
    },
    bonus: { rmRange: [30, 90], leadership: [40, 120] },
    notes: "Variable comp varies widely by book size & profitability; deferrals common.",
  },
  ecosystem: {
    title: "London ecosystem",
    items: ["Alternatives access; club deals", "Tax advisory partners & lending", "Large FO/EAM presence"],
    trends: ["Private markets", "Leverage facilities", "DPM growth"],
  },
};

/* ---------------- New York ---------------- */
const newYork: Market = {
  slug: "new-york",
  name: "New York",
  country: "United States",
  city: "New York",
  region: "US",
  summary:
    "New York is the flagship US wealth hub, combining UHNW domestic coverage, sophisticated lending platforms, and strong connectivity to private markets.",
  ctaJobsHref: "/jobs?market=new-york",
  mandates: [
    { title: "Senior Private Banker — US", summary: "UHNW/HNW domestic; strong acquisition and lending." },
    { title: "Team Lead — UHNW", summary: "Lead UHNW pod; manage pipeline, risk, and profitability." },
  ],
  hiringPulse: [
    "Originators with $2–5m+ recurring revenue and credit velocity win shortlists.",
    "Wealth planning + private markets integration is a retention edge.",
    "Banks favour transparent, risk-clean pipelines over headline AUM claims.",
  ],
  regulatory: [
    "SEC/FINRA",
    "Reg BI; KYC/AML/EDD",
    "Multi-state solicitation rules",
  ],
  comp: {
    currency: "USD",
    baseBands: {
      rmSenior: [200000, 300000],
      rmMid: [140000, 200000],
      teamLead: [280000, 400000],
    },
    bonus: { rmRange: [40, 140], leadership: [50, 160] },
    notes: "Revenue-share models common; total comp can be much higher for top producers.",
  },
  ecosystem: {
    title: "New York ecosystem",
    items: ["Capital markets & alternatives", "Lombard/CRE lending", "Family office connectivity"],
    trends: ["Private credit", "Tax-aware portfolios", "SMAs"],
  },
};

/* ---------------- Miami ---------------- */
const miami: Market = {
  slug: "miami",
  name: "Miami",
  country: "United States",
  city: "Miami",
  region: "US/LatAm",
  summary:
    "Miami is the high-growth hub for LatAm wealth, attracting UHNW families relocating capital with strong FX, credit, and onshore/offshore booking options.",
  ctaJobsHref: "/jobs?market=miami",
  mandates: [
    { title: "Private Banker — LatAm", summary: "UHNW LatAm; FX & credit; bilingual EN/ES." },
    { title: "Desk Head — LatAm", summary: "Build and lead LatAm pod; manage growth and risk." },
  ],
  hiringPulse: [
    "LatAm portability + FX competency drives immediate traction with hiring committees.",
    "Banks are funding growth — relocation and guaranteed draw considered for top books.",
    "Compliance track record on cross-border is scrutinised more than headline revenue.",
  ],
  regulatory: [
    "SEC/FINRA",
    "Cross-border KYC/EDD",
    "OCC/FRB guidance",
  ],
  comp: {
    currency: "USD",
    baseBands: {
      rmSenior: [180000, 270000],
      rmMid: [130000, 180000],
      teamLead: [250000, 360000],
    },
    bonus: { rmRange: [40, 140], leadership: [50, 160] },
    notes: "Relocation grants and revenue-linked models common.",
  },
  ecosystem: {
    title: "Miami ecosystem",
    items: ["LatAm connectivity; FX & credit", "Real-asset financing", "FO relocations & new platforms"],
    trends: ["Relocations", "USD flows", "Private credit"],
  },
};

/* ---------------- Export ---------------- */
export const markets: Market[] = [
  geneva,
  zurich,
  dubai,
  singapore,
  hongKong,
  london,
  newYork,
  miami,
];

export const marketSlugs: string[] = markets.map((m) => m.slug);

export function getMarket(slug: string): Market | undefined {
  return markets.find((m) => m.slug === slug);
}
