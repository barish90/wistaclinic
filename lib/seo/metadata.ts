import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

const baseUrl = 'https://wistaclinic.com';

export type SeoPage = 'home' | 'about' | 'procedures' | 'pricing' | 'doctors' | 'contact' | 'gallery' | 'testimonials' | 'privacy' | 'terms';

export async function generatePageMetadata(
  locale: Locale,
  page: SeoPage,
  path: string = '',
): Promise<Metadata> {
  const dict = await getDictionary(locale);
  const seoSection = dict.seo as Partial<Record<SeoPage, { title: string; description: string }>> | undefined;
  const seo = seoSection?.[page];

  const title = seo?.title || 'WistaClinic';
  const description = seo?.description || '';

  const url = `${baseUrl}/${locale}${path}`;

  const alternateLanguages: Record<string, string> = {};
  for (const loc of locales) {
    alternateLanguages[loc] = `${baseUrl}/${loc}${path}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'WistaClinic',
      locale: ({ zh: 'zh_CN', ar: 'ar_SA', de: 'de_DE', fr: 'fr_FR', es: 'es_ES', it: 'it_IT', ru: 'ru_RU', tr: 'tr_TR', en: 'en_US' } as Record<string, string>)[locale] || locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      languages: alternateLanguages,
    },
  };
}
