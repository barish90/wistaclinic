import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { StructuredData } from '@/app/components/seo/StructuredData';
import type { Locale } from '@/lib/i18n/config';

const rtlLocales = ['ar'] as const;

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale — isValidLocale narrows string to Locale
  if (!isValidLocale(locale)) {
    notFound();
  }
  // After validation, locale is narrowed to Locale — alias to avoid repeated casts
  const validLocale: Locale = locale;

  // Load dictionary
  const dict = await getDictionary(validLocale);
  const dir = rtlLocales.includes(validLocale as typeof rtlLocales[number]) ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className={dir === 'rtl' ? 'rtl' : ''}>
      {/* locale is validated above via isValidLocale() — safe to inline */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${validLocale}";`,
        }}
      />
      <StructuredData locale={validLocale} />
      <Header locale={validLocale} dict={dict} />
      <main className="min-h-screen pt-16 lg:pt-20">
        {children}
      </main>
      <Footer locale={validLocale} dict={dict} />
    </div>
  );
}
