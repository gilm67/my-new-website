// src/i18n/ui.ts
export type Locale = 'en' | 'fr' | 'de';

type Nav = {
  home: string;
  markets: string;
  jobs: string;
  hiringManagers: string; // ✅ added
  simulator: string;
  portability: string;
  insights: string;
  about: string;
  contact: string;
};

type CTAs = {
  submitCv: string;
  hireTalent: string;
  talkToUs: string;
  browseJobs: string;
};

type Footer = {
  executivePartners: string;
  description: string;
  coverage: string;
  marketsWeServe: string;
  company: string;
  viewAllMarkets: string;
  linkedin: string;
};

type UIShape = {
  /** Full labels (footer, long contexts) */
  nav: Nav;
  /** Short labels (top bar) */
  navShort: Nav;
  ctas: CTAs;
  footer: Footer;
};

export const UI: Record<Locale, UIShape> = {
  en: {
    nav: {
      home: 'Home',
      markets: 'Markets We Serve',
      jobs: 'Jobs',
      hiringManagers: 'Hiring Managers', // ✅
      simulator: 'Business Plan Simulator',
      portability: 'Portability Score™',
      insights: 'Insight',
      about: 'About',
      contact: 'Contact',
    },
    navShort: {
      home: 'Home',
      markets: 'Markets',
      jobs: 'Jobs',
      hiringManagers: 'Hiring', // ✅ shorter
      simulator: 'BP Simulator',
      portability: 'Portability™',
      insights: 'Insight',
      about: 'About',
      contact: 'Contact',
    },
    ctas: {
      submitCv: 'Submit CV',
      hireTalent: 'Hire Talent',
      talkToUs: 'Talk to Us',
      browseJobs: 'Browse Jobs',
    },
    footer: {
      executivePartners: 'Executive Partners',
      description:
        'Executive Partners is a Geneva-based recruitment boutique focused on Wealth Management & Private Banking.',
      coverage: 'Coverage',
      marketsWeServe: 'Markets We Serve',
      company: 'Company',
      viewAllMarkets: 'View all markets',
      linkedin: 'LinkedIn',
    },
  },

  fr: {
    nav: {
      home: 'Accueil',
      markets: 'Nos Marchés',
      jobs: 'Jobs',
      hiringManagers: 'Recruteurs', // ✅
      simulator: 'Simulateur Business Plan',
      portability: 'Portability Score™',
      insights: 'Insight',
      about: 'À propos',
      contact: 'Contact',
    },
    navShort: {
      home: 'Accueil',
      markets: 'Marchés',
      jobs: 'Jobs',
      hiringManagers: 'Recruter', // ✅ shorter
      simulator: 'Simulateur',
      portability: 'Portability',
      insights: 'Insight',
      about: 'À propos',
      contact: 'Contact',
    },
    ctas: {
      submitCv: 'Soumettre CV',
      hireTalent: 'Recruter',
      talkToUs: 'Parlons-en',
      browseJobs: 'Voir les Jobs',
    },
    footer: {
      executivePartners: 'Executive Partners',
      description:
        'Executive Partners est un cabinet de recrutement basé à Genève, spécialisé en Gestion de Fortune et Banque Privée.',
      coverage: 'Couverture',
      marketsWeServe: 'Nos Marchés',
      company: 'Entreprise',
      viewAllMarkets: 'Voir tous les marchés',
      linkedin: 'LinkedIn',
    },
  },

  de: {
    nav: {
      home: 'Start',
      markets: 'Märkte',
      jobs: 'Jobs',
      hiringManagers: 'Für Hiring Manager', // ✅
      simulator: 'Business-Plan-Simulator',
      portability: 'Portability Score™',
      insights: 'Insight',
      about: 'Über uns',
      contact: 'Kontakt',
    },
    navShort: {
      home: 'Start',
      markets: 'Märkte',
      jobs: 'Jobs',
      hiringManagers: 'Hiring', // ✅ shorter
      simulator: 'Simulator',
      portability: 'Portability',
      insights: 'Insight',
      about: 'Über uns',
      contact: 'Kontakt',
    },
    ctas: {
      submitCv: 'CV hochladen',
      hireTalent: 'Talente finden',
      talkToUs: 'Kontaktieren Sie uns',
      browseJobs: 'Jobs ansehen',
    },
    footer: {
      executivePartners: 'Executive Partners',
      description:
        'Executive Partners ist eine in Genf ansässige Personalberatung mit Fokus auf Private Banking und Wealth Management.',
      coverage: 'Abdeckung',
      marketsWeServe: 'Märkte',
      company: 'Unternehmen',
      viewAllMarkets: 'Alle Märkte ansehen',
      linkedin: 'LinkedIn',
    },
  },
};
