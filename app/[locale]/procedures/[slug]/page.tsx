import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getProcedureBySlug } from '@/lib/data/procedures';
import { GsapProvider } from '@/app/components/shared/GsapProvider';
import { AnimatedSection } from '@/app/components/shared/AnimatedSection';
import { ProcedureDetailHero } from '@/app/components/sections/procedures/ProcedureDetailHero';
import { ProcedureSteps } from '@/app/components/sections/procedures/ProcedureSteps';
import { ProcedureFAQ } from '@/app/components/sections/procedures/ProcedureFAQ';
import { ProcedureCTA } from '@/app/components/sections/procedures/ProcedureCTA';

interface ProcedureDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProcedureDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return { title: 'Not Found' };
  const procedure = getProcedureBySlug(slug);
  if (!procedure) return { title: 'Not Found' };

  const dict = await getDictionary(locale);
  const siteTitle = dict.seo?.home?.title || 'WistaClinic';

  return {
    title: `${procedure.title} | ${siteTitle}`,
    description: procedure.description,
  };
}

export default async function ProcedureDetailPage({
  params,
}: ProcedureDetailPageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const procedure = getProcedureBySlug(slug);

  if (!procedure) {
    notFound();
  }

  const detail = (dict?.procedures?.detail ?? {}) as Record<string, string>;

  return (
    <GsapProvider>
      <div className="min-h-screen">
        {/* Hero Section */}
        <ProcedureDetailHero
          title={procedure.title}
          description={procedure.description}
        />

        {/* Steps Section */}
        <AnimatedSection animation="fadeUp">
          <ProcedureSteps steps={procedure.steps} />
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection animation="fadeUp" delay={0.2}>
          <ProcedureFAQ faqs={procedure.faq} />
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection animation="fadeUp" delay={0.3}>
          <ProcedureCTA
            title={detail.ctaTitle ?? 'Want to learn more?'}
            description={detail.ctaDescription ?? 'Schedule a confidential consultation to discuss your goals and create a personalized treatment plan.'}
            buttonText={detail.ctaButton ?? 'Book Consultation'}
            locale={locale}
          />
        </AnimatedSection>
      </div>
    </GsapProvider>
  );
}
