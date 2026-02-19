export const locales = ["en", "tr", "de", "fr", "es", "it", "ar", "ru", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  ar: 'العربية',
  ru: 'Русский',
  zh: '中文',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/** OpenGraph locale identifiers for each supported locale */
export const OG_LOCALE_MAP: Record<Locale, string> = {
  en: 'en_US',
  tr: 'tr_TR',
  de: 'de_DE',
  fr: 'fr_FR',
  es: 'es_ES',
  it: 'it_IT',
  ar: 'ar_SA',
  ru: 'ru_RU',
  zh: 'zh_CN',
};
