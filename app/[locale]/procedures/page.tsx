import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { SectionHeading } from '@/app/components/shared/SectionHeading';
import { ProcedureGrid } from '@/app/components/sections/procedures/ProcedureGrid';
import { GsapProvider } from '@/app/components/shared/GsapProvider';
import { AnimatedSection } from '@/app/components/shared/AnimatedSection';

interface ProceduresPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProceduresPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale, 'procedures', '/procedures');
}

export default async function ProceduresPage({ params }: ProceduresPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <GsapProvider>
      <div className="min-h-screen py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={dict.procedures.index.title}
            subtitle={dict.procedures.index.subtitle}
            className="mb-16"
          />

          <AnimatedSection animation="fadeUp" delay={0.2}>
            <ProcedureGrid locale={locale} className="max-w-7xl mx-auto" />
          </AnimatedSection>
        </div>
      </div>
    </GsapProvider>
  );
}
