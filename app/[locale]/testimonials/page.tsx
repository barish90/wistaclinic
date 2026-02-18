import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { GsapProvider } from '@/app/components/shared/GsapProvider';
import { AnimatedSection } from '@/app/components/shared/AnimatedSection';
import { SectionHeading } from '@/app/components/shared/SectionHeading';
import { TestimonialGrid } from '@/app/components/sections/testimonials/TestimonialGrid';

interface TestimonialsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TestimonialsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale, 'testimonials', '/testimonials');
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const testimonialsDict = (dict as unknown as Record<string, Record<string, string> | undefined>)?.testimonials;
  const title = testimonialsDict?.title ?? 'What Our Patients Say';
  const subtitle = testimonialsDict?.subtitle ??
    'Real stories from real patients who trusted us with their care. Every review is from a verified patient who traveled to Istanbul for their procedure.';

  return (
    <GsapProvider>
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeUp">
            <SectionHeading title={title} subtitle={subtitle} />
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={0.2} className="mt-12">
            <TestimonialGrid />
          </AnimatedSection>
        </div>
      </section>
    </GsapProvider>
  );
}
