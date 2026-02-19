import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/app/components/shared/Logo';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const navItems = [
    { href: `/${locale}/`, label: dict.nav.home || 'Home' },
    { href: `/${locale}/about`, label: dict.nav.about || 'About' },
    { href: `/${locale}/procedures`, label: dict.nav.procedures || 'Procedures' },
    { href: `/${locale}/doctors`, label: dict.nav.doctors || 'Doctors' },
    { href: `/${locale}/gallery`, label: dict.nav.gallery || 'Gallery' },
    { href: `/${locale}/testimonials`, label: dict.nav.testimonials || 'Testimonials' },
    { href: `/${locale}/contact`, label: dict.nav.contact || 'Contact' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/wistaclinic', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/wistaclinic', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/wistaclinic', label: 'Twitter' },
    { icon: Youtube, href: 'https://www.youtube.com/@wistaclinic', label: 'YouTube' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}/`} className="inline-block mb-4">
              <Logo size="lg" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {dict.footer?.description ?? ''}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">
              {dict.footer?.quickLinks ?? 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">
              {dict.footer?.contactUs ?? 'Contact Us'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>{dict.contact?.info?.address ?? ''}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`tel:${dict.contact?.info?.phone ?? ''}`}
                  className="transition-colors hover:text-primary"
                >
                  {dict.contact?.info?.phone ?? ''}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${dict.contact?.info?.email ?? ''}`}
                  className="transition-colors hover:text-primary"
                >
                  {dict.contact?.info?.email ?? ''}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} WistaClinic. {dict.footer?.rights ?? 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Link
                href={`/${locale}/privacy`}
                className="transition-colors hover:text-primary"
              >
                {dict.footer?.privacyPolicy ?? 'Privacy Policy'}
              </Link>
              <span>&middot;</span>
              <Link
                href={`/${locale}/terms`}
                className="transition-colors hover:text-primary"
              >
                {dict.footer?.termsOfService ?? 'Terms of Service'}
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground mr-2">
              {dict.footer?.followUs ?? 'Follow Us'}:
            </span>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
