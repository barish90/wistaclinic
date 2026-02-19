import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { procedures } from '@/lib/data/procedures';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wistaclinic.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '',
    '/about',
    '/procedures',
    '/pricing',
    '/doctors',
    '/contact',
    '/gallery',
    '/testimonials',
    '/privacy',
    '/terms',
  ];

  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/procedures' ? 0.9 : 0.7,
      });
    }

    // Procedure detail pages
    for (const procedure of procedures) {
      entries.push({
        url: `${baseUrl}/${locale}/procedures/${procedure.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
