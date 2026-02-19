import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProcedureCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  locale: string;
  className?: string;
  learnMoreLabel?: string;
}

export function ProcedureCard({
  slug,
  title,
  shortDescription,
  locale,
  className,
  learnMoreLabel = 'Learn More',
}: ProcedureCardProps) {
  return (
    <Link href={`/${locale}/procedures/${slug}`}>
      <Card
        className={cn(
          'group overflow-hidden border-bronze/20 bg-gradient-to-br from-background to-champagne/5 hover:shadow-xl transition-all duration-500 h-full',
          className
        )}
      >
        <CardContent className="p-0">
          {/* Image placeholder with gradient */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-bronze via-champagne to-bronze-light">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />

            {/* Decorative overlay */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.3),transparent)]" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <h3 className="font-serif text-2xl font-semibold text-foreground group-hover:text-bronze-deep transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed line-clamp-3">
              {shortDescription}
            </p>

            {/* Read more link */}
            <div className="flex items-center gap-2 text-bronze-deep font-medium group-hover:gap-3 transition-all duration-300">
              <span>{learnMoreLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
