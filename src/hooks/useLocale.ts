'use client';

import { useLocaleContext, type Locale } from '@/locale/LocaleContext';

/** Preferred hook name across the app, using the context under the hood. */
export function useLocale(): Locale {
  return useLocaleContext();
}

/** Re-export the provider if any files import it from here. */
export { LocaleProvider } from '@/locale/LocaleContext';
export type { Locale } from '@/locale/LocaleContext';
