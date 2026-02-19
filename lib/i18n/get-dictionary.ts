import type { Locale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  tr: () => import("./dictionaries/tr.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  it: () => import("./dictionaries/it.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
  zh: () => import("./dictionaries/zh.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

// Deep merge: locale dict on top of English fallback
function deepMerge<T extends Record<string, unknown>>(base: T, override: Record<string, unknown>): T {
  const result = { ...base } as Record<string, unknown>;
  for (const key in override) {
    if (
      override[key] &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key]) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        override[key] as Record<string, unknown>,
      );
    } else {
      result[key] = override[key];
    }
  }
  return result as T;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const enDict = await dictionaries.en();

  if (locale === 'en') {
    return enDict;
  }

  const loader = dictionaries[locale];
  if (!loader) {
    return enDict;
  }

  try {
    const localeDict = await loader();
    return deepMerge(enDict, localeDict as Record<string, unknown>);
  } catch (error) {
    console.error(`Failed to load dictionary for locale "${locale}", falling back to English:`, error);
    return enDict;
  }
}
