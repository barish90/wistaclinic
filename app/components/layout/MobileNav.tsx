'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import type { Dictionary } from '@/lib/i18n/get-dictionary';

interface MobileNavProps {
  locale: string;
  dict: Dictionary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ locale, dict, open, onOpenChange }: MobileNavProps) {
  const navItems = [
    { href: `/${locale}/`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/procedures`, label: dict.nav.procedures },
    { href: `/${locale}/doctors`, label: dict.nav.doctors },
    { href: `/${locale}/gallery`, label: (dict.nav as { gallery?: string }).gallery || 'Gallery' },
    { href: `/${locale}/testimonials`, label: (dict.nav as { testimonials?: string }).testimonials || 'Testimonials' },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl text-primary">
            WistaClinic
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-6" />

        <Button
          asChild
          size="lg"
          className="w-full font-medium"
          onClick={handleLinkClick}
        >
          <Link href={`/${locale}/contact`}>
            {dict.nav.bookConsultation}
          </Link>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
