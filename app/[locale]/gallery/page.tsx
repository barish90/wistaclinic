import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { SectionHeading } from '@/app/components/shared/SectionHeading';
import { GsapProvider } from '@/app/components/shared/GsapProvider';
import { AnimatedSection } from '@/app/components/shared/AnimatedSection';
import { GalleryGrid } from '@/app/components/sections/gallery/GalleryGrid';

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale, 'gallery', '/gallery');
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const galleryDict = dict.gallery;
  const title = galleryDict?.title ?? 'Before & After Gallery';
  const subtitle = galleryDict?.subtitle ?? 'See the transformative results our patients have achieved through our world-class procedures.';

  return (
    <GsapProvider>
      <main className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <AnimatedSection animation="fadeUp">
            <SectionHeading title={title} subtitle={subtitle} />
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={0.2} className="mt-12">
            <GalleryGrid />
          </AnimatedSection>
        </section>
      </main>
    </GsapProvider>
  );
}
