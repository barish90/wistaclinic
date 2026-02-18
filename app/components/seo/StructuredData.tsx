import type { Locale } from '@/lib/i18n/config';

interface StructuredDataProps {
  locale: Locale;
}

export function StructuredData({ locale }: StructuredDataProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'WistaClinic',
    description: 'World-class surgical and aesthetic excellence in Istanbul. Specializing in rhinoplasty, breast augmentation, hair transplant, body contouring, and facial aesthetics.',
    url: `https://wistaclinic.com/${locale}`,
    logo: 'https://wistaclinic.com/images/logo/logo-gold-no-title.webp',
    image: 'https://wistaclinic.com/images/logo/logo-gold-no-title.webp',
    telephone: '+90 507 080 8888',
    email: 'info@wistaclinic.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Merkez, Cendere Cad. No:9',
      addressLocality: 'Kagithane',
      addressRegion: 'Istanbul',
      postalCode: '34406',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.0821,
      longitude: 28.9784,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    medicalSpecialty: [
      'PlasticSurgery',
      'Dermatology',
    ],
    availableService: [
      {
        '@type': 'MedicalProcedure',
        name: 'Rhinoplasty',
        procedureType: 'SurgicalProcedure',
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Breast Augmentation',
        procedureType: 'SurgicalProcedure',
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Hair Transplant',
        procedureType: 'SurgicalProcedure',
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Liposuction',
        procedureType: 'SurgicalProcedure',
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Brazilian Butt Lift',
        procedureType: 'SurgicalProcedure',
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Facial Aesthetics',
        procedureType: 'SurgicalProcedure',
      },
      {
        '@type': 'MedicalProcedure',
        name: 'Body Contouring',
        procedureType: 'SurgicalProcedure',
      },
    ],
    priceRange: '€€€',
    currenciesAccepted: 'EUR, USD, TRY, GBP',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 1250,
      bestRating: 5,
      worstRating: 1,
    },
  };

  // Schema is hardcoded static data, safe for JSON serialization
  const jsonLd = JSON.stringify(schema);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
