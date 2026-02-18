import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { SectionHeading } from '@/app/components/shared/SectionHeading';
import { GsapProvider } from '@/app/components/shared/GsapProvider';
import { AnimatedSection } from '@/app/components/shared/AnimatedSection';
import { ContactForm } from '@/app/components/sections/contact/ContactForm';
import { ContactInfo } from '@/app/components/sections/contact/ContactInfo';
import { MapEmbed } from '@/app/components/sections/contact/MapEmbed';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale, 'contact', '/contact');
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <GsapProvider>
      <div className="min-h-screen py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={dict.contact.title}
            subtitle={dict.contact.subtitle}
            className="mb-16"
          />

          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left column: Contact Form */}
              <AnimatedSection animation="fadeUp">
                <ContactForm labels={dict.contact.form} />
              </AnimatedSection>

              {/* Right column: Contact Info & Map */}
              <div className="space-y-8">
                <AnimatedSection animation="fadeUp" delay={0.1}>
                  <ContactInfo info={dict.contact.info} />
                </AnimatedSection>

                <AnimatedSection animation="fadeUp" delay={0.2}>
                  <MapEmbed />
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GsapProvider>
  );
}
