'use client';
import React, { createContext, useContext } from 'react';

export type Locale = 'en' | 'fr' | 'de';

const LocaleContext = createContext<Locale>('en');

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocaleContext(): Locale {
  return useContext(LocaleContext);
}
