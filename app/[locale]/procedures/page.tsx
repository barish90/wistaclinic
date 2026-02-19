import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n/config';
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
  if (!isValidLocale(locale)) return { title: 'Not Found' };
  return generatePageMetadata(locale, 'procedures', '/procedures');
}

export default async function ProceduresPage({ params }: ProceduresPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <GsapProvider>
      <div className="min-h-screen py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={dict.procedures?.index?.title ?? 'Our Procedures'}
            subtitle={dict.procedures?.index?.subtitle ?? ''}
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
