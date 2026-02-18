'use client';

import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/lib/data/gallery';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface BeforeAfterCardProps {
  item: GalleryImage;
  className?: string;
}

export function BeforeAfterCard({ item, className }: BeforeAfterCardProps) {
  return (
    <div
      className={cn(
        'group rounded-xl overflow-hidden bg-card border border-border shadow-sm',
        'hover:shadow-md transition-shadow duration-300',
        className
      )}
    >
      <BeforeAfterSlider
        beforeGradient={item.beforeGradient}
        afterGradient={item.afterGradient}
      />
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}
