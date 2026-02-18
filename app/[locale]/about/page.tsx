import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { GsapProvider } from '@/app/components/shared/GsapProvider';
import { AnimatedSection } from '@/app/components/shared/AnimatedSection';
import { PhilosophyHero } from '@/app/components/sections/about/PhilosophyHero';
import { ValuesGrid } from '@/app/components/sections/about/ValuesGrid';
import { ClinicTour } from '@/app/components/sections/about/ClinicTour';
import { Accreditations } from '@/app/components/sections/about/Accreditations';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale, 'about', '/about');
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <GsapProvider>
      <div className="min-h-screen">
        {/* Hero Section */}
        <PhilosophyHero
          title={dict.about.hero.title}
          description={dict.about.hero.description}
        />

        {/* Values Section */}
        <AnimatedSection animation="fadeUp">
          <ValuesGrid
            title={dict.about.values.title}
            values={dict.about.values.items}
          />
        </AnimatedSection>

        {/* Clinic Tour Section */}
        <AnimatedSection animation="fadeUp" delay={0.2}>
          <ClinicTour
            title={dict.about.tour.title}
            description={dict.about.tour.description}
          />
        </AnimatedSection>

        {/* Accreditations Section */}
        <AnimatedSection animation="fadeUp" delay={0.3}>
          <Accreditations
            title={dict.about.accreditations.title}
            description={dict.about.accreditations.description}
          />
        </AnimatedSection>
      </div>
    </GsapProvider>
  );
}
