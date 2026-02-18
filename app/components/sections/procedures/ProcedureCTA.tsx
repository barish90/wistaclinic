import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProcedureCTAProps {
  title: string;
  description: string;
  buttonText: string;
  locale: string;
  className?: string;
}

export function ProcedureCTA({
  title,
  description,
  buttonText,
  locale,
  className,
}: ProcedureCTAProps) {
  return (
    <section className={cn('py-20 sm:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-bronze via-bronze-deep to-bronze p-12 sm:p-16 text-center">
          {/* Decorative background overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent)]" />

          <div className="relative space-y-6">
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              {title}
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-bronze-deep hover:bg-cream font-semibold px-8 py-6 text-lg"
              >
                <Link href={`/${locale}/contact`}>{buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
