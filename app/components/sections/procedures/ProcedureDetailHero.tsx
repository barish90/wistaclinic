import { cn } from '@/lib/utils';

interface ProcedureDetailHeroProps {
  title: string;
  description: string;
  className?: string;
}

export function ProcedureDetailHero({
  title,
  description,
  className,
}: ProcedureDetailHeroProps) {
  return (
    <section className={cn('relative py-20 sm:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Text content */}
          <div className="space-y-6">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {description}
            </p>
          </div>

          {/* Image placeholder */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-bronze-light via-champagne to-bronze shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Decorative overlay */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.4),transparent)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
