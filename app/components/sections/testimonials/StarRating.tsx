import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, size = 16, className }: StarRatingProps) {
  return (
    <div role="img" className={cn('flex items-center gap-0.5', className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            'transition-colors',
            i < rating
              ? 'fill-bronze text-bronze'
              : 'fill-none text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );
}
