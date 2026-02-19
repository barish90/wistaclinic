import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n/config';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return { title: 'Not Found' };
  return generatePageMetadata(locale, 'privacy', '/privacy');
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

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

          {/* 1. Introduction */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              WistaClinic (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              a healthcare and aesthetic medicine clinic located in Istanbul,
              Turkey, providing dental, beauty, weight loss, and laboratory
              services to domestic and international patients. We are committed
              to protecting your personal data and respecting your privacy. This
              Privacy Policy explains how we collect, use, store, and share your
              information when you interact with our website, services, and
              facilities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By using our website or engaging our services, you acknowledge that
              you have read and understood this Privacy Policy. We process
              personal data in accordance with the Turkish Law on the Protection
              of Personal Data (KVKK, Law No. 6698), and, where applicable, the
              European Union General Data Protection Regulation (GDPR). For
              patients residing in the United States, please note that
              WistaClinic is a Turkish healthcare provider and is not a
              &quot;covered entity&quot; under the U.S. Health Insurance
              Portability and Accountability Act (HIPAA). Protections afforded
              by HIPAA do not apply to care received outside the United States.
            </p>
          </section>

          {/* 2. Information We Collect */}
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
              <li>Preferred language of communication</li>
            </ul>
            <h3 className="font-semibold text-base mt-6 mb-3">
              Medical and Health Data (Special Category Data)
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-2 ml-4 text-sm italic">
              Health data is classified as special category personal data under
              KVKK Article 6 and GDPR Article 9, and is subject to enhanced
              protections.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>Medical history, current medications, and known allergies</li>
              <li>Diagnostic records, lab results, and imaging studies</li>
              <li>Treatment plans, consent forms, and clinical notes</li>
              <li>Photographs and video recordings taken before, during, and after procedures for medical documentation purposes</li>
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
            <h3 className="font-semibold text-base mt-6 mb-3">
              Communication Data
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>Emails, messages, and correspondence (including WhatsApp and other messaging platforms)</li>
              <li>Consultation notes and inquiries submitted through our website</li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We process your personal data for the following purposes and on
              the corresponding legal bases:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Treatment and Care:</strong> To provide medical
                consultations, diagnoses, treatment planning, and post-operative
                follow-up care across our dental, beauty, weight loss, and
                laboratory departments. <em>(Legal basis: KVKK Art. 6 — explicit
                consent and legal obligation; GDPR Art. 9(2)(h) — healthcare
                provision.)</em>
              </li>
              <li>
                <strong>Communication:</strong> To respond to your inquiries,
                schedule appointments, send pre-arrival instructions, and provide
                post-treatment guidance. <em>(Legal basis: KVKK Art. 5 —
                contractual necessity; GDPR Art. 6(1)(b) — performance of a
                contract.)</em>
              </li>
              <li>
                <strong>Administrative Purposes:</strong> To process payments,
                manage bookings, coordinate travel and accommodation arrangements,
                and maintain patient records. <em>(Legal basis: contractual
                necessity and legitimate interest.)</em>
              </li>
              <li>
                <strong>Legal Compliance:</strong> To fulfill our obligations
                under Turkish healthcare regulations, tax legislation, and
                applicable data protection laws. <em>(Legal basis: KVKK Art. 5 —
                legal obligation; GDPR Art. 6(1)(c).)</em>
              </li>
              <li>
                <strong>Quality Improvement:</strong> To analyze treatment
                outcomes, conduct internal audits, and improve the quality of
                our services. <em>(Legal basis: legitimate interest.)</em>
              </li>
              <li>
                <strong>Marketing:</strong> With your explicit consent, to send
                you promotional materials, newsletters, and information about
                new services or special offers. <em>(Legal basis: KVKK Art. 5 —
                explicit consent; GDPR Art. 6(1)(a) — consent.)</em>
              </li>
            </ul>
          </section>

          {/* 4. Patient Photography, Videography, and Use of Images */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              4. Patient Photography, Videography, and Use of Images
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Photographs and video recordings of patients are classified as
              special category health data under both KVKK (Article 6) and GDPR
              (Article 9). We take the following approach to patient images:
            </p>

            <h3 className="font-semibold text-base mt-6 mb-3">
              4.1 Clinical Documentation
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may photograph or record patients before, during, and after
              procedures for the purpose of medical documentation, treatment
              planning, and clinical record-keeping. This is conducted as part
              of our standard medical care and is covered by your treatment
              consent.
            </p>

            <h3 className="font-semibold text-base mt-6 mb-3">
              4.2 Marketing and Advertising Use
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We will never use your photographs, videos, testimonials, or
              before-and-after images for marketing, advertising, or
              promotional purposes without your separate, explicit, freely
              given written consent. Consent for marketing use of images is
              obtained through a standalone Photography and Media Release
              Consent Form, which is entirely separate from your treatment
              consent. You are not required to consent to marketing use of
              your images as a condition of receiving treatment.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Photography and Media Release Consent Form specifies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>The exact platforms and media on which your images may appear (e.g., WistaClinic website, Instagram, Facebook, TikTok, YouTube, paid digital advertisements, print brochures, medical conference presentations)</li>
              <li>Whether your images will be used in an identifiable or anonymized manner</li>
              <li>The duration for which consent is granted</li>
              <li>Your right to withdraw consent at any time</li>
            </ul>

            <h3 className="font-semibold text-base mt-6 mb-3">
              4.3 Results Disclaimer on Published Images
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All before-and-after images published by WistaClinic in any
              marketing material, advertisement, or online platform will be
              accompanied by the following disclosure: &quot;Individual results
              may vary. This image depicts one patient&apos;s result and is not
              a guarantee of outcome for any other patient. Results depend on
              individual factors including age, health, skin type, and
              adherence to post-procedure care.&quot;
            </p>

            <h3 className="font-semibold text-base mt-6 mb-3">
              4.4 Withdrawal of Consent for Image Use
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may withdraw your consent for marketing use of your images at
              any time by submitting a written request to{' '}
              <a
                href="mailto:privacy@wistaclinic.com"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                privacy@wistaclinic.com
              </a>
              . Upon receipt of a valid withdrawal request, WistaClinic will:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>Cease all future use of your images in new marketing materials</li>
              <li>Remove your images from all digital platforms (website, social media, online advertisements) within 30 calendar days</li>
              <li>Make commercially reasonable efforts to recall or discontinue distribution of printed materials containing your images</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Withdrawal of consent does not affect the lawfulness of
              processing carried out prior to withdrawal. Images used in
              materials already printed and distributed before the withdrawal
              date may remain in circulation, but will not be reprinted or
              redistributed.
            </p>

            <h3 className="font-semibold text-base mt-6 mb-3">
              4.5 Third-Party Image Sharing
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              WistaClinic will not share your images with any third-party
              publication, media outlet, medical tourism facilitator, or partner
              organization not specifically listed in your Photography and Media
              Release Consent Form without obtaining renewed, specific consent
              from you.
            </p>
          </section>

          {/* 5. Data Sharing & Third Parties */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              5. Data Sharing and Third Parties
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal data. We may share your information
              with the following categories of recipients only when necessary:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Healthcare Professionals:</strong> Specialist
                consultants, laboratories, and partner medical facilities
                involved in your treatment (acting as independent data
                controllers or joint controllers as applicable).
              </li>
              <li>
                <strong>Service Providers:</strong> Payment processors, IT
                service providers, translation services, and travel/accommodation
                coordinators (acting as data processors under written Data
                Processing Agreements).
              </li>
              <li>
                <strong>Medical Tourism Facilitators:</strong> Referring agencies
                involved in coordinating your visit, only to the extent
                necessary to arrange your treatment and logistics, and only
                with your consent.
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
              <li>
                <strong>Advertising Platforms:</strong> Anonymized or aggregated
                data only (no identifiable patient data) for the purpose of
                measuring marketing campaign effectiveness.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All third-party data processors are contractually obligated under
              written Data Processing Agreements to protect your data, process
              it solely for the purposes we specify, and comply with applicable
              data protection laws.
            </p>
          </section>

          {/* 6. International Data Transfers */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              6. International Data Transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a clinic based in Istanbul, Turkey, serving international
              patients, your personal data is primarily processed and stored in
              Turkey. Cross-border data transfers may occur when we communicate
              with your referring physician, insurer, or medical tourism
              facilitator in your home country.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate safeguards for international data
              transfers in compliance with KVKK Law No. 6698 (as amended in
              2024), including Standard Contractual Clauses approved by the
              Turkish Personal Data Protection Authority. For patients who are
              residents of the European Economic Area (EEA), please note that
              Turkey has not been granted an EU adequacy decision under GDPR.
              Accordingly, transfers of EU patient data are protected by EU
              Standard Contractual Clauses in accordance with the European
              Commission&apos;s decisions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may request a copy of the applicable transfer mechanisms by
              contacting us at{' '}
              <a
                href="mailto:privacy@wistaclinic.com"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                privacy@wistaclinic.com
              </a>
              .
            </p>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              7. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under applicable data protection legislation, you have the
              following rights regarding your personal data:
            </p>
            <h3 className="font-semibold text-base mt-6 mb-3">
              Under KVKK (All Patients)
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>Right to learn whether your personal data is being processed</li>
              <li>Right to request information about the purposes of processing and whether data is used in accordance with those purposes</li>
              <li>Right to know which third parties your data has been transferred to, domestically or abroad</li>
              <li>Right to request rectification of incomplete or inaccurate data</li>
              <li>Right to request erasure or destruction of your data where the grounds for processing no longer exist</li>
              <li>Right to object to adverse results arising from automated processing of your data</li>
              <li>Right to claim compensation for damages arising from unlawful processing</li>
            </ul>
            <h3 className="font-semibold text-base mt-6 mb-3">
              Additional Rights Under GDPR (EU/EEA Residents)
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Right of Access:</strong> You may obtain a copy of your
                personal data being processed.
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
                without affecting the lawfulness of prior processing and without
                detriment to the quality of care you receive.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To exercise any of these rights, submit a written request by email
              to{' '}
              <a
                href="mailto:privacy@wistaclinic.com"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                privacy@wistaclinic.com
              </a>{' '}
              or by registered letter to our clinic address. We will verify your
              identity before processing any request and respond within 30 days.
              Patients exercising their rights will not be disadvantaged in the
              provision of clinical services as a result.
            </p>
          </section>

          {/* 8. Data Retention */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              8. Data Retention
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
                accordance with the Turkish Commercial Code.
              </li>
              <li>
                <strong>Patient Photographs (Clinical):</strong> Retained as part
                of your medical record for the same period as medical records.
              </li>
              <li>
                <strong>Patient Photographs (Marketing):</strong> Retained for
                the duration of your consent, or until consent is withdrawn.
                Images will be deleted from digital platforms within 30 days of
                withdrawal. Maximum retention: 10 years from date of capture.
              </li>
              <li>
                <strong>Marketing Consent Records:</strong> Retained for the
                duration of your consent plus 3 years following withdrawal.
              </li>
              <li>
                <strong>Communication Records:</strong> Retained for 3 years from
                the date of last correspondence.
              </li>
              <li>
                <strong>Website Usage Data:</strong> Retained for up to 2 years
                from the date of collection.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              After the applicable retention period expires, your data will be
              securely deleted, destroyed, or irreversibly anonymized in
              accordance with the By-Law on Erasure, Destruction or
              Anonymization of Personal Data.
            </p>
          </section>

          {/* 9. Medical Disclaimers */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              9. Medical Disclaimers and Limitation of Liability
            </h2>

            <h3 className="font-semibold text-base mt-6 mb-3">
              9.1 Website Content Disclaimer
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Content on this website, including descriptions of services,
              procedures, expected recovery times, and patient testimonials, is
              provided for general informational purposes only. It does not
              constitute medical advice and must not be relied upon as a
              substitute for consultation with a qualified medical professional.
              Prospective patients should seek individualized medical advice
              before making any treatment decisions.
            </p>

            <h3 className="font-semibold text-base mt-6 mb-3">
              9.2 Results and Outcomes
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All medical and aesthetic procedures carry inherent risks and
              uncertainties. Results vary significantly between individual
              patients based on factors including, but not limited to, age,
              skin type, overall health, genetic factors, lifestyle, and
              adherence to post-procedure care instructions. Before-and-after
              photographs displayed on this website represent results achieved
              by specific patients and are not representative of outcomes that
              can be expected by all patients. WistaClinic makes no
              representation, warranty, or guarantee regarding the outcome of
              any procedure.
            </p>

            <h3 className="font-semibold text-base mt-6 mb-3">
              9.3 Risk of Complications
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All surgical and non-surgical procedures involve risk of
              complications, including but not limited to infection, scarring,
              asymmetry, adverse anesthetic reaction, nerve damage, and, in
              rare cases, serious injury. Patients will receive a detailed,
              procedure-specific informed consent document prior to treatment
              that enumerates all material risks specific to their chosen
              procedure(s). By proceeding with treatment, patients acknowledge
              that they have been informed of and accept these risks.
            </p>

            <h3 className="font-semibold text-base mt-6 mb-3">
              9.4 Limitation of Liability
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              WistaClinic maintains professional medical liability insurance as
              required by Turkish law. WistaClinic does not exclude or limit
              liability for death or personal injury caused by its proven medical
              negligence. However, to the fullest extent permitted by applicable
              law, WistaClinic expressly disclaims liability for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>Complications arising from a patient&apos;s failure to follow pre-procedure or post-procedure instructions provided by the treating physician</li>
              <li>Complications arising from pre-existing medical conditions, medications, or allergies that were not disclosed to WistaClinic prior to treatment</li>
              <li>Aesthetic results that, while not the patient&apos;s desired outcome, fall within the medically expected range of outcomes for the relevant procedure</li>
              <li>Costs incurred for follow-up treatment, revision procedures, or corrective care obtained by the patient from third-party providers without prior consultation with WistaClinic</li>
              <li>Adverse events attributable to the patient&apos;s non-compliance with prescribed medications, activity restrictions, or follow-up appointment schedules</li>
              <li>Travel-related costs, lost income, or consequential losses arising from the need for additional treatment or extended recovery</li>
            </ul>

            <h3 className="font-semibold text-base mt-6 mb-3">
              9.5 Patient Responsibilities
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Patients are responsible for accurately and completely disclosing
              their full medical history, current medications, known allergies,
              prior surgical procedures, and any other information material to
              their treatment. Patients must also comply with all pre-operative
              and post-operative instructions, attend scheduled follow-up
              appointments, and inform WistaClinic promptly of any adverse
              symptoms or complications. WistaClinic accepts no liability for
              complications arising from a patient&apos;s failure to make
              complete and accurate disclosures or to follow medical
              instructions.
            </p>

            <h3 className="font-semibold text-base mt-6 mb-3">
              9.6 Testimonials and Reviews
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Patient testimonials, reviews, and success stories published on
              this website or our social media channels reflect the individual
              experiences of those patients. They are not intended as a
              guarantee of results, and prospective patients should not rely
              on testimonials as a substitute for professional medical
              consultation. Testimonials are published with the explicit consent
              of the patient and may be edited for clarity or brevity, but the
              substance of the feedback is not altered.
            </p>
          </section>

          {/* 10. Governing Law and Jurisdiction */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              10. Governing Law and Jurisdiction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All services provided by WistaClinic are subject to the laws of
              the Republic of Turkey. This Privacy Policy and any dispute
              arising from the use of our website or the provision of our
              services shall be governed by Turkish law and subject to the
              exclusive jurisdiction of the courts of Istanbul, Turkey.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By receiving treatment at WistaClinic, patients acknowledge that
              their legal recourse is governed by Turkish law, including the
              Turkish Code of Obligations and applicable medical practice
              legislation, and that legal remedies available in their home
              country may not apply to services rendered in Turkey.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This clause does not affect your statutory rights under applicable
              data protection laws (including KVKK and GDPR), nor your right
              to lodge a complaint with the relevant supervisory authority in
              your country of residence.
            </p>
          </section>

          {/* 11. Cookies & Tracking */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              11. Cookies and Tracking Technologies
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
              settings or our cookie consent mechanism. Disabling certain cookies
              may affect the functionality of our website. Non-essential cookies
              require your opt-in consent before being placed on your device.
            </p>
          </section>

          {/* 12. Children's Privacy */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              12. Children&apos;s Privacy
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

          {/* 13. Data Security and Breach Notification */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              13. Data Security and Breach Notification
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access, alteration,
              disclosure, or destruction. These measures include encrypted data
              transmission (SSL/TLS), secure server infrastructure, role-based
              access controls, staff confidentiality agreements, and regular
              security assessments.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In the event of a personal data breach that is likely to result
              in a risk to your rights and freedoms, WistaClinic will notify the
              Turkish Personal Data Protection Authority (KVKK) within 72 hours
              of becoming aware of the breach, and will notify affected
              individuals without undue delay, in accordance with KVKK and GDPR
              requirements.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While we take every reasonable precaution to protect your data, no
              method of transmission over the internet or electronic storage is
              completely secure. We cannot guarantee absolute security but are
              committed to maintaining the highest standards of data protection.
            </p>
          </section>

          {/* 14. Contact for Privacy Inquiries */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              14. Contact for Privacy Inquiries
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
              Authority (KVKK) at{' '}
              <a
                href="https://www.kvkk.gov.tr"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                kvkk.gov.tr
              </a>
              . EU/EEA residents may also lodge a complaint with their national
              data protection supervisory authority.
            </p>
          </section>

          {/* 15. Changes to Policy */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              15. Changes to This Privacy Policy
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
