import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './StarRating';
import { countryFlags } from '@/lib/data/testimonials';
import { getProcedureBySlug } from '@/lib/data/procedures';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/lib/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  locale?: string;
  className?: string;
}

function getProcedureTitle(slug: string): string {
  return getProcedureBySlug(slug)?.title ?? slug;
}

function formatDate(isoDate: string, locale = 'en-US'): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
  });
}

export function TestimonialCard({ testimonial, locale, className }: TestimonialCardProps) {
  const flag = countryFlags[testimonial.country] ?? '';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-[#D4A847]/30 hover:shadow-lg hover:shadow-[#D4A847]/5',
        className
      )}
    >
      <CardContent className="p-6">
        {/* Quote icon */}
        <Quote className="mb-3 h-6 w-6 text-[#D4A847]/40" />

        {/* Quote text */}
        <blockquote className="mb-4 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Star rating */}
        <StarRating rating={testimonial.rating} size={14} className="mb-4" />

        {/* Divider */}
        <div className="mb-4 h-px w-full bg-border/50" />

        {/* Patient info */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">
              {testimonial.name}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                , {testimonial.age}
              </span>
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {flag && <span className="mr-1">{flag}</span>}
              {testimonial.country}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Badge
              variant="secondary"
              className="whitespace-nowrap bg-[#D4A847]/10 text-[#B8860B] hover:bg-[#D4A847]/20"
            >
              {getProcedureTitle(testimonial.procedure)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(testimonial.date, locale)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
