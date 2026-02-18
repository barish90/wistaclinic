import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale, 'privacy', '/privacy');
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  await params;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm mb-12">
            Last updated: February 2026
          </p>

          {/* Introduction */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              WistaClinic (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              a healthcare and beauty clinic located in Istanbul, Turkey. We are
              committed to protecting your personal data and respecting your
              privacy. This Privacy Policy explains how we collect, use, store,
              and share your information when you interact with our website,
              services, and facilities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By using our website or engaging our services, you acknowledge that
              you have read and understood this Privacy Policy. We process
              personal data in accordance with the Turkish Law on the Protection
              of Personal Data (KVKK, Law No. 6698) and, where applicable, the
              European Union General Data Protection Regulation (GDPR).
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              2. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect the following categories of personal data:
            </p>
            <h3 className="font-semibold text-base mt-6 mb-3">
              Personal Identification Data
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>Full name, date of birth, nationality, and gender</li>
              <li>Contact information (email address, phone number, postal address)</li>
              <li>Passport or national ID details (required for medical treatment in Turkey)</li>
              <li>Emergency contact information</li>
            </ul>
            <h3 className="font-semibold text-base mt-6 mb-3">
              Medical and Health Data
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>Medical history, current medications, and known allergies</li>
              <li>Diagnostic records, lab results, and imaging studies</li>
              <li>Treatment plans, consent forms, and clinical notes</li>
              <li>Photographs taken for medical documentation purposes</li>
              <li>Insurance details and claims information</li>
            </ul>
            <h3 className="font-semibold text-base mt-6 mb-3">
              Usage and Technical Data
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>IP address, browser type, device information, and operating system</li>
              <li>Pages visited, time spent on pages, and navigation patterns</li>
              <li>Referral sources and search queries that led you to our site</li>
              <li>Cookie identifiers and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We process your personal data for the following purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Treatment and Care:</strong> To provide medical
                consultations, diagnoses, treatment planning, and post-operative
                follow-up care across our dental, beauty, weight loss, and
                laboratory departments.
              </li>
              <li>
                <strong>Communication:</strong> To respond to your inquiries,
                schedule appointments, send pre-arrival instructions, and provide
                post-treatment guidance.
              </li>
              <li>
                <strong>Administrative Purposes:</strong> To process payments,
                manage bookings, coordinate travel and accommodation arrangements,
                and maintain patient records.
              </li>
              <li>
                <strong>Legal Compliance:</strong> To fulfill our obligations
                under Turkish healthcare regulations, tax legislation, and
                applicable data protection laws.
              </li>
              <li>
                <strong>Quality Improvement:</strong> To analyze treatment
                outcomes, conduct internal audits, and improve the quality of
                our services.
              </li>
              <li>
                <strong>Marketing:</strong> With your explicit consent, to send
                you promotional materials, newsletters, and information about
                new services or special offers.
              </li>
            </ul>
          </section>

          {/* Data Sharing & Third Parties */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              4. Data Sharing and Third Parties
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal data. We may share your information
              with the following categories of recipients only when necessary:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Healthcare Professionals:</strong> Specialist
                consultants, laboratories, and partner medical facilities
                involved in your treatment.
              </li>
              <li>
                <strong>Service Providers:</strong> Payment processors, IT
                service providers, translation services, and travel/accommodation
                coordinators operating under data processing agreements.
              </li>
              <li>
                <strong>Legal and Regulatory Authorities:</strong> Turkish
                Ministry of Health, tax authorities, and other governmental
                bodies as required by law.
              </li>
              <li>
                <strong>Insurance Companies:</strong> When processing claims on
                your behalf and with your written consent.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All third-party service providers are contractually obligated to
              protect your data and use it solely for the purposes we specify.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              5. International Data Transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a clinic based in Istanbul, Turkey, your personal data is
              primarily processed and stored in Turkey. If you are located
              outside Turkey (for example, in the European Economic Area), please
              be aware that your data will be transferred to and processed in
              Turkey.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate safeguards for international data
              transfers, including standard contractual clauses and ensuring that
              any data transfer complies with applicable data protection laws.
              Turkey has been recognized by the Turkish Personal Data Protection
              Authority (KVKK) as maintaining adequate data protection standards.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              6. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under applicable data protection legislation (including GDPR for
              EU/EEA residents and KVKK for all individuals), you have the
              following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Right of Access:</strong> You may request confirmation
                of whether your personal data is being processed and obtain a
                copy of that data.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You may request
                correction of inaccurate or incomplete personal data.
              </li>
              <li>
                <strong>Right to Erasure:</strong> You may request deletion of
                your personal data where there is no compelling reason for its
                continued processing, subject to legal retention requirements.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You may request your
                personal data in a structured, commonly used, and
                machine-readable format.
              </li>
              <li>
                <strong>Right to Restriction:</strong> You may request that we
                limit the processing of your personal data under certain
                circumstances.
              </li>
              <li>
                <strong>Right to Object:</strong> You may object to the
                processing of your personal data for direct marketing or where
                processing is based on legitimate interests.
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> Where processing is
                based on your consent, you may withdraw that consent at any time
                without affecting the lawfulness of prior processing.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To exercise any of these rights, please contact our Data
              Protection Officer using the details provided below. We will
              respond to your request within 30 days.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              7. Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We retain your personal data only for as long as necessary to
              fulfill the purposes for which it was collected, or as required by
              applicable law. Specific retention periods include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Medical Records:</strong> Retained for a minimum of 20
                years following your last treatment, as required by Turkish
                healthcare regulations.
              </li>
              <li>
                <strong>Financial Records:</strong> Retained for 10 years in
                accordance with Turkish tax legislation.
              </li>
              <li>
                <strong>Marketing Consent Records:</strong> Retained for the
                duration of your consent plus 3 years following withdrawal.
              </li>
              <li>
                <strong>Website Usage Data:</strong> Retained for up to 2 years
                from the date of collection.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              After the applicable retention period expires, your data will be
              securely deleted or anonymized.
            </p>
          </section>

          {/* Cookies & Tracking */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              8. Cookies and Tracking Technologies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our website uses cookies and similar tracking technologies to
              enhance your browsing experience and analyze site usage. We use the
              following types of cookies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Essential Cookies:</strong> Required for the website to
                function properly, including session management and language
                preferences.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors interact with our website so we can improve content and
                functionality.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to deliver relevant
                advertisements and measure the effectiveness of marketing
                campaigns (only with your consent).
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can manage your cookie preferences through your browser
              settings. Disabling certain cookies may affect the functionality
              of our website.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our website and services are not directed at individuals under the
              age of 18. We do not knowingly collect personal data from children
              without parental or guardian consent. For patients under 18,
              consent must be provided by a parent or legal guardian, and all
              communications will be directed to the responsible adult.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If we become aware that we have inadvertently collected personal
              data from a child without appropriate consent, we will take steps
              to delete that data promptly.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              10. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access, alteration,
              disclosure, or destruction. These measures include encrypted data
              transmission (SSL/TLS), secure server infrastructure, access
              controls, and regular security assessments.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While we take every reasonable precaution to protect your data, no
              method of transmission over the internet or electronic storage is
              completely secure. We cannot guarantee absolute security but are
              committed to maintaining the highest standards of data protection.
            </p>
          </section>

          {/* Contact for Privacy Inquiries */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              11. Contact for Privacy Inquiries
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, wish to
              exercise your data protection rights, or have concerns about how
              your personal data is handled, please contact our Data Protection
              Officer:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Data Protection Officer</strong>
              </li>
              <li>WistaClinic</li>
              <li>Istanbul, Turkey</li>
              <li>
                Email:{' '}
                <a
                  href="mailto:privacy@wistaclinic.com"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  privacy@wistaclinic.com
                </a>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you are not satisfied with our response, you have the right to
              lodge a complaint with the Turkish Personal Data Protection
              Authority (KVKK) or, if you are an EU/EEA resident, with your
              local supervisory authority.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, legal requirements, or regulatory
              guidance. Any material changes will be posted on this page with an
              updated revision date. We encourage you to review this policy
              periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
