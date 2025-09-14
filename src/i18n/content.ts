export type Locale = 'en' | 'fr' | 'de';

type Section = { title: string; body?: string };
type HiringManagersContent = {
  badge?: string;
  title: string;
  intro?: string;
  bullets?: string[];
  sections?: Section[];
  ctas?: { primary?: string; secondary?: string };
};

type Dict = {
  hiringManagers: HiringManagersContent;
};

export const CONTENT: Record<Locale, Dict> = {
  en: {
    hiringManagers: {
      badge: 'For Hiring Managers',
      title: 'Targeted shortlists with real portability',
      intro:
        'We map your relevant markets and deliver vetted Relationship Managers and Private Bankers with portable books. Clear coverage, licensing and onboarding reality—before interviews.',
      bullets: [
        'Market-mapped shortlists in 10–15 business days',
        'Verified cross-border coverage and licensing',
        'HNW/UHNW focus with transparent portability',
        'Discreet outreach and candidate briefing',
      ],
      sections: [
        {
          title: 'What we deliver',
          body:
            'A curated slate of Relationship Managers aligned to your booking centre(s), language mix, product scope and risk framework. Each profile includes coverage notes, indicative AUM portability and onboarding constraints.',
        },
        {
          title: 'How we work',
          body:
            'We align the brief (coverage, AUM, onboarding) and activate a discreet approach. Weekly progress updates, candidate feedback loops and tight coordination with compliance ensure speed without surprises.',
        },
      ],
      ctas: {
        primary: 'Request a shortlist',
        secondary: 'Talk to us',
      },
    },
  },

  fr: {
    hiringManagers: {
      badge: 'Pour les recruteurs',
      title: 'Shortlists ciblées avec une vraie portabilité',
      intro:
        'Nous cartographions votre marché et présentons des Banquiers Privés / RMs réellement portables. Couverture, licences et contraintes d’onboarding clarifiées avant les entretiens.',
      bullets: [
        'Shortlists cartographiées en 10–15 jours ouvrables',
        'Couverture transfrontalière et licences vérifiées',
        'Focalisation HNW/UHNW avec portabilité transparente',
        'Approche discrète et briefing candidat',
      ],
      sections: [
        {
          title: 'Notre livrable',
          body:
            'Une sélection de Relationship Managers alignés sur vos booking centres, langues, périmètre produits et cadre de risque. Chaque profil inclut notes de couverture, portabilité AUM indicative et contraintes d’onboarding.',
        },
        {
          title: 'Notre approche',
          body:
            'Cadrage du besoin (couverture, AUM, onboarding), activation d’une approche confidentielle, points d’avancement hebdomadaires et retours candidats. Coordination rapprochée avec la conformité pour avancer vite et sans surprises.',
        },
      ],
      ctas: {
        primary: 'Demander une shortlist',
        secondary: 'Parler avec nous',
      },
    },
  },

  de: {
    hiringManagers: {
      badge: 'Für Hiring Manager',
      title: 'Zielgerichtete Shortlists mit echter Portabilität',
      intro:
        'Wir kartieren Ihren relevanten Markt und liefern geprüfte Relationship Manager und Private Banker mit portablen Assets. Abdeckung, Lizenzen und Onboarding-Realität – vor den Interviews klar dargestellt.',
      bullets: [
        'Marktkartierte Shortlists in 10–15 Werktagen',
        'Geprüfte grenzüberschreitende Abdeckung und Lizenzen',
        'Fokus auf HNW/UHNW mit transparenter Portabilität',
        'Diskrete Ansprache und Kandidaten-Briefing',
      ],
      sections: [
        {
          title: 'Unser Deliverable',
          body:
            'Eine kuratierte Auswahl an Relationship Managern, abgestimmt auf Ihre Booking-Center, Sprachen, Produktscope und Risikorahmen. Jedes Profil enthält Coverage-Notizen, indikative AUM-Portabilität und Onboarding-Constraints.',
        },
        {
          title: 'Unsere Arbeitsweise',
          body:
            'Briefing-Abgleich (Coverage, AUM, Onboarding), diskrete Direktansprache, wöchentliche Updates und Kandidaten-Feedback. Enge Abstimmung mit Compliance für Tempo ohne Überraschungen.',
        },
      ],
      ctas: {
        primary: 'Shortlist anfordern',
        secondary: 'Kontakt aufnehmen',
      },
    },
  },
};
