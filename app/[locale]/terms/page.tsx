import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n/config';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return { title: 'Not Found' };
  return generatePageMetadata(locale, 'terms', '/terms');
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Terms of Service
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
              Welcome to WistaClinic. These Terms of Service
              (&quot;Terms&quot;) govern your use of our website, services,
              and facilities. WistaClinic is a healthcare and beauty clinic
              located in Istanbul, Turkey, offering dental, aesthetic, weight
              management, and laboratory services to both local and
              international patients.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By accessing our website or engaging our services, you agree to
              be bound by these Terms. If you do not agree with any part of
              these Terms, please do not use our website or services.
            </p>
          </section>

          {/* Medical Disclaimer */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              2. Medical Disclaimer
            </h2>
            <div className="border border-border rounded-lg p-6 mb-4 bg-muted/30">
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>IMPORTANT:</strong> The information provided on our
                website and during consultations is intended for general
                informational purposes and does not constitute medical advice.
                All medical and aesthetic procedures carry inherent risks, and
                individual results may vary significantly.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
                <li>
                  Treatment outcomes are not guaranteed. Results depend on
                  individual health conditions, anatomy, lifestyle factors, and
                  adherence to pre- and post-operative instructions.
                </li>
                <li>
                  Before and after photographs displayed on our website represent
                  individual cases and should not be interpreted as a promise of
                  similar results.
                </li>
                <li>
                  We strongly recommend that patients seek a second medical
                  opinion before proceeding with any elective procedure,
                  particularly when traveling internationally for treatment.
                </li>
                <li>
                  All procedures, risks, alternatives, and expected outcomes will
                  be discussed thoroughly during your consultation. You will be
                  required to provide written informed consent before any
                  treatment begins.
                </li>
              </ul>
            </div>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              3. Services Description
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              WistaClinic provides a range of healthcare and aesthetic services,
              including but not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Dental Services:</strong> General dentistry, cosmetic
                dentistry, dental implants, veneers, crowns, teeth whitening,
                and orthodontics.
              </li>
              <li>
                <strong>Beauty and Aesthetic Services:</strong> Facial
                rejuvenation, body contouring, hair transplantation, skin
                treatments, and non-surgical aesthetic procedures.
              </li>
              <li>
                <strong>Weight Management:</strong> Bariatric surgery
                consultations, nutritional guidance, and weight loss programs.
              </li>
              <li>
                <strong>Laboratory Services:</strong> Diagnostic testing, blood
                work, and health screening packages.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The availability of specific treatments and procedures may change
              without prior notice. Detailed information about each service is
              provided during the consultation process.
            </p>
          </section>

          {/* Patient Responsibilities */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              4. Patient Responsibilities
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a patient, you agree to the following responsibilities:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Honest Medical History:</strong> You must provide
                complete, accurate, and truthful information regarding your
                medical history, current medications, allergies, and any
                pre-existing conditions. Failure to disclose relevant medical
                information may affect treatment safety and outcomes.
              </li>
              <li>
                <strong>Pre-Operative Instructions:</strong> You must follow all
                pre-operative instructions provided by our medical team,
                including fasting requirements, medication adjustments, and
                lifestyle modifications.
              </li>
              <li>
                <strong>Post-Operative Care:</strong> You must adhere to all
                post-treatment and post-operative care instructions, including
                medication schedules, activity restrictions, dietary guidelines,
                and wound care protocols.
              </li>
              <li>
                <strong>Follow-Up Appointments:</strong> You must attend all
                scheduled follow-up appointments, whether in person or via
                telemedicine, to ensure proper monitoring of your recovery.
              </li>
              <li>
                <strong>Travel Fitness:</strong> You must ensure you are
                medically fit to travel before and after treatment. Our medical
                team will advise on appropriate waiting periods before return
                travel.
              </li>
            </ul>
          </section>

          {/* Consultation & Treatment Agreement */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              5. Consultation and Treatment Agreement
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All treatments begin with a thorough consultation, which may be
              conducted remotely (via video call or email) or in person at our
              clinic. During the consultation:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                Our medical team will assess your suitability for the requested
                procedure and discuss treatment options, risks, benefits, and
                alternatives.
              </li>
              <li>
                A personalized treatment plan and cost estimate will be provided.
                This estimate may be subject to change based on findings during
                the procedure.
              </li>
              <li>
                Written informed consent is required before any treatment. You
                have the right to ask questions, request additional information,
                and take time to make your decision.
              </li>
              <li>
                We reserve the right to decline or postpone treatment if our
                medical team determines that it is not in your best interest or
                if you are not a suitable candidate.
              </li>
            </ul>
          </section>

          {/* Pricing & Payment Terms */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              6. Pricing and Payment Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All prices are quoted in US Dollars (USD), Euros (EUR), or Turkish
              Lira (TRY) and are subject to change. The following payment terms
              apply:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>Deposits:</strong> A non-refundable deposit of 20% may
                be required to secure your appointment and treatment schedule.
                This deposit will be applied toward your total treatment cost.
              </li>
              <li>
                <strong>Full Payment:</strong> The remaining balance is due
                before or on the day of treatment, unless alternative payment
                arrangements have been agreed upon in writing.
              </li>
              <li>
                <strong>Payment Methods:</strong> We accept bank transfers,
                credit/debit cards, and cash payments. Additional processing
                fees may apply for certain payment methods.
              </li>
              <li>
                <strong>Price Adjustments:</strong> If additional treatments or
                procedures are identified as necessary during your visit, you
                will be informed and your consent obtained before any additional
                costs are incurred.
              </li>
            </ul>
            <h3 className="font-semibold text-base mt-6 mb-3">
              Cancellation Policy
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                Cancellations made more than 14 days before the scheduled
                treatment date are eligible for a deposit refund minus a 10%
                administrative fee.
              </li>
              <li>
                Cancellations made within 14 days of the scheduled treatment
                date will forfeit the deposit.
              </li>
              <li>
                Rescheduling is permitted up to twice without penalty, subject
                to availability.
              </li>
              <li>
                No-shows without prior notice will forfeit the full deposit
                amount.
              </li>
            </ul>
          </section>

          {/* Travel & Accommodation */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              7. Travel and Accommodation
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Unless explicitly included in a treatment package agreed upon in
              writing, patients are responsible for arranging and covering the
              costs of their own travel, accommodation, and related expenses.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                Where travel and accommodation are included in a treatment
                package, the specific details (hotel category, transfer type,
                duration) will be outlined in your treatment agreement.
              </li>
              <li>
                We may provide recommendations for hotels, transportation, and
                travel services, but we are not responsible for the quality or
                availability of third-party services.
              </li>
              <li>
                Patients are responsible for obtaining valid travel documents
                (passport, visa), travel insurance, and any required
                vaccinations.
              </li>
              <li>
                We strongly recommend that all international patients obtain
                comprehensive travel and medical insurance that covers their
                treatment in Turkey.
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To the fullest extent permitted by applicable law:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                WistaClinic and its medical professionals shall not be liable for
                any indirect, incidental, consequential, or punitive damages
                arising from or related to our services.
              </li>
              <li>
                Our liability for direct damages shall not exceed the total
                amount paid by the patient for the specific treatment in
                question.
              </li>
              <li>
                We are not liable for complications arising from a
                patient&apos;s failure to disclose relevant medical information,
                follow pre- or post-operative instructions, or attend follow-up
                appointments.
              </li>
              <li>
                We are not responsible for delays, cancellations, or
                complications arising from events beyond our reasonable control,
                including natural disasters, pandemics, travel disruptions, or
                government actions.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nothing in these Terms limits our liability for death or personal
              injury caused by our negligence or for fraud or fraudulent
              misrepresentation.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              9. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content on this website, including text, graphics, logos,
              images, videos, and software, is the property of WistaClinic or
              its content suppliers and is protected by Turkish and international
              intellectual property laws.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may not reproduce, distribute, modify, display, or create
              derivative works from any content on our website without our prior
              written consent. Limited use for personal, non-commercial purposes
              is permitted, provided that you do not remove any copyright or
              proprietary notices.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              10. Governing Law and Jurisdiction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms are governed by and construed in accordance with the
              laws of the Republic of Turkey. Any disputes arising from or
              related to these Terms or our services shall be subject to the
              exclusive jurisdiction of the courts of Istanbul, Turkey.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For international patients, we encourage resolution of any
              concerns through direct communication with our patient relations
              team before pursuing formal legal proceedings. We are committed to
              resolving disputes amicably whenever possible.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              11. Changes to These Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. Material
              changes will be posted on this page with an updated revision date.
              Your continued use of our website or services after changes are
              posted constitutes your acceptance of the revised Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For patients with active treatment plans, any changes to these
              Terms will not affect the terms agreed upon in your existing
              treatment agreement.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="font-serif text-xl font-semibold mt-10 mb-4">
              12. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mb-4 ml-4">
              <li>
                <strong>WistaClinic</strong>
              </li>
              <li>Istanbul, Turkey</li>
              <li>
                Email:{' '}
                <a
                  href="mailto:info@wistaclinic.com"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  info@wistaclinic.com
                </a>
              </li>
              <li>
                Privacy inquiries:{' '}
                <a
                  href="mailto:privacy@wistaclinic.com"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  privacy@wistaclinic.com
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
