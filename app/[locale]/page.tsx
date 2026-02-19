import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { GsapProvider } from '@/app/components/shared/GsapProvider';
import { SectionReveal } from '@/app/components/shared/SectionReveal';
import {
  ThreadHero,
  ServicesGrid,
  PatientJourney,
  DoctorProfiles,
  ResultsShowcase,
  TestimonialsCarousel,
  BookingCTA,
} from '@/app/components/sections/home';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale, 'home');
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <GsapProvider>
      <ThreadHero locale={locale} dict={dict} />
      <SectionReveal>
        <ServicesGrid locale={locale} dict={dict} />
      </SectionReveal>
      <SectionReveal>
        <PatientJourney dict={dict} />
      </SectionReveal>
      <SectionReveal>
        <DoctorProfiles locale={locale} dict={dict} />
      </SectionReveal>
      <SectionReveal>
        <ResultsShowcase locale={locale} dict={dict} />
      </SectionReveal>
      <SectionReveal>
        <TestimonialsCarousel dict={dict} />
      </SectionReveal>
      <SectionReveal>
        <BookingCTA locale={locale} dict={dict} />
      </SectionReveal>
    </GsapProvider>
  );
}
