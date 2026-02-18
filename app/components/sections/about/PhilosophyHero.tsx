import { cn } from '@/lib/utils';

interface PhilosophyHeroProps {
  title: string;
  description: string;
  className?: string;
}

export function PhilosophyHero({ title, description, className }: PhilosophyHeroProps) {
  return (
    <section className={cn('relative py-24 sm:py-32 overflow-hidden', className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bronze/5 via-champagne/10 to-cream/5" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-muted-foreground sm:text-2xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
