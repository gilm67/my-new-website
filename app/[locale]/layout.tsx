import { LocaleProvider } from '@/locale/LocaleContext';

type Props = { children: React.ReactNode; params: { locale: string } };

const LOCALES = ['en','fr','de'] as const;
type Locale = typeof LOCALES[number];
function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export const dynamic = 'force-static';
export function generateStaticParams() { return LOCALES.map((l) => ({ locale: l })); }

export default function LocaleLayout({ children, params }: Props) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
